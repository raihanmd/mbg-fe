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
import { getBalances } from './utils/getBalance';
import { getUsdcBalance } from './utils/getUsdcBalance';
import { checkDeployed } from './utils/deployment';
import { handleDeploySmartAccount } from './handler/deploySmartAccount';
import { handleManageSkill, executeManageAction } from './handler/manageSkill';
import { handleWithdrawFunds } from './handler/withdrawFunds';
import {
  formatTokenAmount,
  formatDate,
  formatExecutionStatus,
  statusEmoji,
} from './utils/format';

async function buildHomeContent() {
  const { userAddress, smartAccountAddress } =
    await getSmartAccountAddressInSnap();
  const [skills, installations, isDeployed] = await Promise.all([
    getAllSkills(),
    getAllInstalledSkills(userAddress),
    checkDeployed(smartAccountAddress),
  ]);

  const balances = isDeployed
    ? await getBalances(smartAccountAddress)
    : { eth: '0.00', usdc: '0.00' };
  const ethBalance = balances.eth;
  const usdcBalance = balances.usdc;

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

      <Section>
        <Row label="Network">
          <Text>
            <Bold>Base Sepolia</Bold>
          </Text>
        </Row>
      </Section>

      {isDeployed ? (
        <Section>
          <Row label="Smart Account">
            <Text>✅ Deployed</Text>
          </Row>
          <Row label="ETH Balance">
            <Text>{ethBalance} ETH</Text>
          </Row>
          <Row label="USDC Balance">
            <Text>{usdcBalance} USDC</Text>
          </Row>
          <Address address={smartAccountAddress} />
          <Copyable value={smartAccountAddress} />
        </Section>
      ) : (
        <Box>
          <Section>
            <Row label="Smart Account">
              <Text color="error">
                <Bold>⚠ Not Deployed</Bold>
              </Text>
            </Row>
            <Text>
              Your smart account must be deployed before installing skills.
            </Text>
            <Button name="nav:deploy-account" variant="primary">
              Deploy Now
            </Button>
          </Section>
          <Divider />
        </Box>
      )}

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
              <Button
                name={`manage-skill:${item._id}:${item.status === 'paused' ? 'resume' : 'pause'}`}
                size="md"
              >
                {item.status === 'paused' ? 'Resume' : 'Pause'}
              </Button>
              <Button
                name={`manage-skill:${item._id}:revoke`}
                size="md"
                variant="destructive"
              >
                Revoke
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

      {isDeployed && (
        <Box>
          <Divider />
          <Section>
            <Row label="Withdraw">
              <Text>
                Withdraw funds from your smart account to your EOA
              </Text>
            </Row>
            <Button name="withdraw-eth" variant="primary" size="md">
              Withdraw ETH
            </Button>
            <Button name="withdraw-weth" variant="primary" size="md">
              Withdraw WETH
            </Button>
            <Button name="withdraw-usdc" variant="primary" size="md">
              Withdraw USDC
            </Button>
          </Section>
        </Box>
      )}
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
      if (event.name === 'nav:deploy-account') {
        await handleDeploySmartAccount({ id });
        return;
      }
      if (event.name.startsWith('nav:history:')) {
        const installationId = event.name.split(':')[2];
        await handleExecutionHistory({ id, installationId });
        return;
      }
      if (event.name === 'nav:home') {
        await renderHomePage(id);
        return;
      }

      // Manage skill — show confirmation screen
      if (event.name.startsWith('manage-skill:')) {
        const parts = event.name.split(':');
        const installationId = parts[1];
        const action = parts[2] as 'revoke' | 'pause' | 'resume';
        const { userAddress } = await getSmartAccountAddressInSnap();
        const installations = await getAllInstalledSkills(userAddress);
        const installation = installations.data.find(
          (i) => i._id === installationId,
        );
        const skillName = installation?.skillId?.name ?? 'Unknown';
        await handleManageSkill({
          id,
          installationId,
          action,
          userAddress,
          skillName,
        });
        return;
      }

      // Execute confirmed manage action
      if (event.name.startsWith('confirm-manage:')) {
        const parts = event.name.split(':');
        const installationId = parts[1];
        const action = parts[2] as 'revoke' | 'pause' | 'resume';
        const { userAddress } = await getSmartAccountAddressInSnap();
        const installations = await getAllInstalledSkills(userAddress);
        const installation = installations.data.find(
          (i) => i._id === installationId,
        );
        const skillName = installation?.skillId?.name ?? 'Unknown';
        await executeManageAction({
          id,
          installationId,
          action,
          userAddress,
          skillName,
        });
        return;
      }

      // Withdraw ETH — show confirmation (two-phase flow in handler)
      if (event.name === 'withdraw-eth') {
        const { userAddress, smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        await handleWithdrawFunds({
          id,
          token: 'eth',
          userAddress,
          smartAccountAddress,
        });
        return;
      }

      // Withdraw WETH — show confirmation (two-phase flow in handler)
      if (event.name === 'withdraw-weth') {
        const { userAddress, smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        await handleWithdrawFunds({
          id,
          token: 'weth',
          userAddress,
          smartAccountAddress,
        });
        return;
      }

      // Withdraw USDC — show confirmation (two-phase flow in handler)
      if (event.name === 'withdraw-usdc') {
        const { userAddress, smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        await handleWithdrawFunds({
          id,
          token: 'usdc',
          userAddress,
          smartAccountAddress,
        });
        return;
      }

      // Confirm withdraw — execute the actual withdrawal
      if (event.name.startsWith('confirm-withdraw:')) {
        const token = event.name.split(':')[1] as 'eth' | 'weth' | 'usdc';
        const { userAddress, smartAccountAddress } =
          await getSmartAccountAddressInSnap();
        await handleWithdrawFunds({
          id,
          token,
          userAddress,
          smartAccountAddress,
        });
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
