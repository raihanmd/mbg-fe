import {
  OnHomePageHandler,
  OnUserInputHandler,
  UserInputEventType,
  OnSignatureHandler,
} from '@metamask/snaps-sdk';
import {
  Box,
  Text,
  Selector,
  SelectorOption,
  Card,
  Heading,
  Button,
  Bold,
  Divider,
  Form,
  Row,
  Section,
  Address,
  Copyable,
} from '@metamask/snaps-sdk/jsx';
import { getAllSkills } from './api/skills';
import { getAllInstalledSkills } from './api/installations';
import handleSkillSelectorFormSubmit from './handler/skillSelectorForm';
import { handleConfirmInstallation } from './handler/confirmInstallation';
import { handlePrepareInstallation } from './handler/prepareInstallation';
import { handleExecutionHistory } from './handler/executionHistory';
import { getSmartAccountAddressInSnap } from './utils/smartAccount';
import { getUsdcBalance } from './utils/getUsdcBalance';
import {
  formatTokenAmount,
  formatDate,
  formatExecutionStatus,
  statusEmoji,
} from './utils/format';

async function buildHomeContent() {
  const { userAddress, smartAccountAddress } =
    await getSmartAccountAddressInSnap();
  const [skills, installations] = await Promise.all([
    getAllSkills(),
    getAllInstalledSkills(userAddress),
  ]);

  const skillNameMap = new Map(
    skills.map((s) => [s.skillId, s.name]),
  );

  const activeInstallations = installations.data.filter(
    (item) =>
      item.status === 'active' ||
      item.status === 'paused' ||
      item.status === 'pending' ||
      item.status === 'failed',
  );

  return (
    <Box>
      <Heading>DCA Skill Wallet</Heading>

      <Text>Installed Skills</Text>
      <Divider />

      {activeInstallations.length === 0 ? (
        <Text>
          No skills installed yet. Choose one below to get started.
        </Text>
      ) : (
        activeInstallations.slice(0, 10).map((item) => {
          const rawAmount =
            item.parameters?.amountUsdc ??
            item.parameters?.amountPerRun;
          const humanAmount = rawAmount
            ? formatTokenAmount(rawAmount as string)
            : 'N/A';
          const tokenTarget = item.parameters?.outputToken
            ? (item.parameters.outputToken as string).toUpperCase()
            : 'N/A';
          const skillName =
            skillNameMap.get(item.skillId?.skillId ?? '') ??
            item.skillId?.name ??
            'Unknown';
          const nextRun = formatDate(item.nextExecutionAt);
          const networkName =
            item.chainId === 84532
              ? 'Base Sepolia'
              : `Chain ${item.chainId}`;

          return (
            <Box key={item._id}>
              <Section>
                <Row label="Strategy">
                  <Text>
                    <Bold>{skillName}</Bold>
                  </Text>
                </Row>
                <Row label="Network">
                  <Text>{networkName}</Text>
                </Row>
                <Row label="DCA">
                  <Text>
                    {humanAmount} USDC → {tokenTarget}
                  </Text>
                </Row>
                <Row label="Next Run">
                  <Text>{nextRun}</Text>
                </Row>
                <Row label="Status">
                  <Text>
                    {statusEmoji(item.status)}{' '}
                    {formatExecutionStatus(item.status)}
                  </Text>
                </Row>
              </Section>
              <Button
                name={`nav:history:${item._id}`}
                variant="primary"
                size="md"
              >
                View History
              </Button>
              <Divider />
            </Box>
          );
        })
      )}

      <Divider />
      <Text>Available Skills</Text>

      <Form name="skill-selector-form">
        <Selector
          name="skill-selector"
          title="Choose Skill"
          value={skills[0]?._id}
        >
          {skills.map((skill) => (
            <SelectorOption key={skill._id} value={skill._id}>
              <Card
                value={skill.name}
                title={skill.name}
                image={skill.iconUrl}
              />
            </SelectorOption>
          ))}
        </Selector>

        <Button
          name="submit-dca"
          type="submit"
          variant="primary"
          size="md"
        >
          Install Skill
        </Button>
      </Form>

      <Divider />
      <Section>
        <Row label="Smart Account">
          <Address address={smartAccountAddress} />
        </Row>
        <Copyable value={smartAccountAddress} />
      </Section>
    </Box>
  );
}

async function renderHomePage(id: string) {
  try {
    const ui = await buildHomeContent();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui },
    });
  } catch (error: any) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Error</Heading>
            <Text>
              {error?.message ??
                'Something went wrong loading the home page.'}
            </Text>
          </Box>
        ),
      },
    });
  }
}

export const onHomePage: OnHomePageHandler = async () => {
  const ui = await buildHomeContent();
  return { content: ui };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  try {
    if (event.type === UserInputEventType.ButtonClickEvent) {
      if (!event.name) return;
      if (event.name.startsWith('nav:history:')) {
        const installationId = event.name.split(':')[2];
        await handleExecutionHistory({ id, installationId });
        return;
      }
      if (event.name === 'nav:home') {
        await renderHomePage(id);
        return;
      }
      return;
    }

    if (event.type === UserInputEventType.FormSubmitEvent) {
      if (!event.name) return;

      if (event.name === 'skill-selector-form') {
        const { smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        const usdcRawBalance = await getUsdcBalance(
          smartAccountAddress,
          84532,
        );
        await handleSkillSelectorFormSubmit({
          id,
          event,
          usdcRawBalance,
          smartAccountAddress,
        });
        return;
      }

      if (event.name.startsWith('prepare-installation-form')) {
        const { userAddress, smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        const eventNameParts = event.name.split(':');
        const extractedSkillId = eventNameParts[1];
        const extractedRunType = eventNameParts[2];
        await handlePrepareInstallation({
          id,
          event,
          selectedSkillId: extractedSkillId!,
          extractedRunType: extractedRunType!,
          userAddress,
          smartAccountAddress,
        });
        return;
      }

      if (event.name.startsWith('sign-delegation-form')) {
        const eventNameParts = event.name.split(':');
        const extractedSkillId = eventNameParts[1];
        const { userAddress, smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        await handleConfirmInstallation({
          id,
          event,
          skillId: extractedSkillId!,
          userAddress,
          smartAccountAddress,
        });
        return;
      }
    }
  } catch (error: any) {
    console.error('Error in onUserInput:', error);
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Error</Heading>
            <Text>
              {error.message ||
                'Something went wrong. Please try again.'}
            </Text>
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
  }
};

export const onSignature: OnSignatureHandler = async ({
  signature,
  signatureOrigin,
}) => {
  return null;
};
