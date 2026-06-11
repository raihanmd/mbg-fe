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
import {
  getAllInstalledSkills,
  revokeInstallation,
  pauseInstallation,
  resumeInstallation,
} from './api/installations';
import handleSkillSelectorFormSubmit from './handler/skillSelectorForm';
import { handleConfirmInstallation } from './handler/confirmInstallation';
import { handlePrepareInstallation } from './handler/prepareInstallation';
import { handleExecutionHistory } from './handler/executionHistory';
import {
  getSmartAccountAddressInSnap,
  persistSelection,
  getSelectedChainId,
  getSelectedAccountType,
} from './utils/smartAccount';
import { getUsdcBalance } from './utils/getUsdcBalance';
import { checkDeployed } from './utils/deployment';
import { handleDeploySmartAccount } from './handler/deploySmartAccount';
import {
  formatTokenAmount,
  formatDate,
  formatExecutionStatus,
  statusEmoji,
  getNetworkName,
} from './utils/format';
import { NETWORK_OPTIONS, getNetworkByChainId } from './utils/networkConfig';

async function buildHomeContent() {
  const selectedChainId = await getSelectedChainId();
  const selectedAccountType = await getSelectedAccountType();

  const { userAddress, smartAccountAddress } =
    await getSmartAccountAddressInSnap({
      chainId: selectedChainId,
      accountType: selectedAccountType,
    });
  const [skills, installations, isDeployed] = await Promise.all([
    getAllSkills(),
    getAllInstalledSkills(userAddress),
    checkDeployed(smartAccountAddress, selectedChainId),
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
      <Form name="network-config-form">
        <Selector
          name="network-selector"
          title="Select Network"
          value={String(selectedChainId)}
        >
          {NETWORK_OPTIONS.map((opt) => (
            <SelectorOption value={opt.value}>
              <Card value={opt.value} title={opt.label} />
            </SelectorOption>
          ))}
        </Selector>
        <Selector
          name="account-type-selector"
          title="Account Type"
          value={selectedAccountType}
        >
          <SelectorOption value="4337">
            <Card
              value="4337"
              title="ERC-4337 (Standard Smart Account)"
            />
          </SelectorOption>
          <SelectorOption value="7702">
            <Card
              value="7702"
              title="ERC-7702 (EOA Upgrade)"
            />
          </SelectorOption>
        </Selector>
        <Button type="submit" variant="primary">
          Apply
        </Button>
      </Form>
      <Divider />

      <Heading>DCA Skill Wallet</Heading>

      {isDeployed ? (
        <Section>
          <Row label="Smart Account">
            <Text>✅ Deployed</Text>
          </Row>
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
          const networkName = getNetworkName(item.chainId);

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
              {item.status === 'active' ? (
                <Box>
                  <Button
                    name={`pause:${item._id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Pause
                  </Button>
                  <Button
                    name={`revoke:${item._id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Revoke
                  </Button>
                </Box>
              ) : null}
              {item.status === 'paused' ? (
                <Box>
                  <Button
                    name={`resume:${item._id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Resume
                  </Button>
                  <Button
                    name={`revoke:${item._id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Revoke
                  </Button>
                </Box>
              ) : null}
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
      if (event.name.startsWith('pause:')) {
        const installationId = event.name.split(':')[1];
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Box>
                <Heading>Pausing Installation</Heading>
                <Text>Please wait...</Text>
              </Box>
            ),
          },
        });
        try {
          const { userAddress } =
            await getSmartAccountAddressInSnap();
          await pauseInstallation(installationId!, userAddress);
          await renderHomePage(id);
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
                      'Failed to pause installation.'}
                  </Text>
                  <Button name="nav:home">Back to Home</Button>
                </Box>
              ),
            },
          });
        }
        return;
      }
      if (event.name.startsWith('resume:')) {
        const installationId = event.name.split(':')[1];
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Box>
                <Heading>Resuming Installation</Heading>
                <Text>Please wait...</Text>
              </Box>
            ),
          },
        });
        try {
          const { userAddress } =
            await getSmartAccountAddressInSnap();
          await resumeInstallation(installationId!, userAddress);
          await renderHomePage(id);
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
                      'Failed to resume installation.'}
                  </Text>
                  <Button name="nav:home">Back to Home</Button>
                </Box>
              ),
            },
          });
        }
        return;
      }
      if (event.name.startsWith('revoke:')) {
        const installationId = event.name.split(':')[1];
        await snap.request({
          method: 'snap_updateInterface',
          params: {
            id,
            ui: (
              <Box>
                <Heading>Revoking Installation</Heading>
                <Text>Please wait...</Text>
              </Box>
            ),
          },
        });
        try {
          const { userAddress } =
            await getSmartAccountAddressInSnap();
          await revokeInstallation(installationId!, userAddress);
          await renderHomePage(id);
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
                      'Failed to revoke installation.'}
                  </Text>
                  <Button name="nav:home">Back to Home</Button>
                </Box>
              ),
            },
          });
        }
        return;
      }
      return;
    }

    if (event.type === UserInputEventType.FormSubmitEvent) {
      if (!event.name) return;

      if (event.name === 'network-config-form') {
        const formValues = (event as any).value as Record<string, any>;
        const chainId = Number(formValues?.['network-selector']);
        const accountType = formValues?.['account-type-selector'] as string;
        if (chainId && (accountType === '4337' || accountType === '7702')) {
          await persistSelection(chainId, accountType);
        }
        await renderHomePage(id);
        return;
      }

      if (event.name === 'skill-selector-form') {
        const selectedChainId = await getSelectedChainId();
        const { smartAccountAddress } =
          await getSmartAccountAddressInSnap({ chainId: selectedChainId });
        const usdcRawBalance = await getUsdcBalance(
          smartAccountAddress,
          selectedChainId,
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