import {
  OnHomePageHandler,
  OnUserInputHandler,
  UserInputEventType,
  type OnRpcRequestHandler,
  OnInstallHandler,
  OnUpdateHandler,
  OnActiveHandler,
  OnStartHandler,
  OnInactiveHandler,
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
} from '@metamask/snaps-sdk/jsx';
import { getAllSkills } from './api/skills';
import { getAllInstalledSkills } from './api/installations';
import handleSkillSelectorFormSubmit from './handler/skillSelectorForm';
import { handleConfirmInstallation } from './handler/confirmInstallation';
import { handlePrepareInstallation } from './handler/prepareInstallation';
import { getSmartAccountAddressInSnap } from './utils/smartAccount';
import { getUsdcBalance } from './utils/getUsdcBalance';
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onHomePage: OnHomePageHandler = async () => {
  const { userAddress } = await getSmartAccountAddressInSnap();
  const [skill, installations] = await Promise.all([
    getAllSkills(),
    getAllInstalledSkills(userAddress),
  ]);
  
const formatSnapshotDate = (dateString: string | null | undefined) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  try {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return 'Invalid Date';
  }
};
  return {
    content: (
      <Box>
        <Heading>DCA Skill Wallet</Heading>
        <Text>Installed skills</Text>
        <Divider />
        <Box>
          {installations.data
            .filter((item) => item.status === 'active').slice(0, 4)
            .map((item) => {
              // --- PROSES KONVERSI DATA DISINI ---
              const rawAmount =
                item.parameters?.amountUsdc ?? item.parameters?.amountPerRun;
              const humanAmount = rawAmount
                ? (Number(rawAmount) / 1_000_000).toFixed(2)
                : 'N/A';
              const tokenTarget =
                item.parameters?.outputToken?.toUpperCase() ?? 'N/A';

              const nextRun = formatSnapshotDate(item.nextExecutionAt);
              const lastRun = formatSnapshotDate(item.lastExecutedAt);

              return (
                <Box key={item._id}>
                  <Row label="Strategy">
                    <Text>
                      <Bold>{item.skillId?.name}</Bold>
                    </Text>
                  </Row>
                  <Row label="Network">
                    <Text>
                      {item.chainId === 84532
                        ? 'Base Sepolia'
                        : String(item.chainId)}
                    </Text>
                  </Row>
                  <Row label="DCA Pair">
                    <Text>
                      {humanAmount} USDC → {tokenTarget}
                    </Text>
                  </Row>
                  <Row label="Next Run">
                    <Text>{nextRun}</Text>
                  </Row>
                  <Row label="Last Run">
                    <Text>{lastRun}</Text>
                  </Row>
                  <Divider />
                </Box>
              );
            })}
        </Box>
        <Divider />
        <Form name="skill-selector-form">
          <Text>Install a new skill</Text>
          <Selector
            name="skill-selector"
            title="Choose Skill"
            value={skill[0]?._id}
          >
            {skill.map((item) => (
              <SelectorOption key={item._id} value={item._id}>
                <Card
                  value={item.name}
                  title={item.name}
                  image={item.iconUrl}
                />
              </SelectorOption>
            ))}
          </Selector>

          <Button name="submit-dca" type="submit" variant="primary" size="md">
            Install Skill
          </Button>
        </Form>
      </Box>
    ),
  };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  try {
    // 1. HANDLE UNTUK SELECTOR FORM (PILIH SKILL)
    if (
      event.type === UserInputEventType.FormSubmitEvent &&
      event.name === 'skill-selector-form'
    ) {
      // Ambil saldo hanya saat form ini disubmit
      const { smartAccountAddress } = await getSmartAccountAddressInSnap();
      const usdcRawBalance = await getUsdcBalance(smartAccountAddress, 84532);

      await handleSkillSelectorFormSubmit({ id, event, usdcRawBalance });
      return; 
    }

    // 2. HANDLE UNTUK TOMBOL CONFIRM INSTALLATION
    if (
      event.type === UserInputEventType.FormSubmitEvent &&
      event.name.startsWith('prepare-installation-form')
    ) {
      // Ambil data address hanya saat user klik tombol confirm
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
    if (
      event.type === UserInputEventType.FormSubmitEvent &&
      event.name.startsWith('sign-delegation-form')
    ) {
      const eventNameParts = event.name.split(':');
      const extractedSkillId = eventNameParts[1];

      const { userAddress, smartAccountAddress } =
        await getSmartAccountAddressInSnap();

      // 1. Ambil data dari secure Snap state storage
      await handleConfirmInstallation({
        id,
        event,
        skillId: extractedSkillId!,
        userAddress,
        smartAccountAddress,
      });

      return;
    }
  } catch (error: any) {
    console.error('Error in onUserInput:', error);
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Text>
              Error:{' '}
              {error.message ||
                'Something went wrong when controlling your DCA Skill'}
            </Text>
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
  // Returning null tells MetaMask that this Snap has no objections
  // and provides no extra UI insights for this signature.
  return null;
};
