import { prepareInstallation } from '../api/installations';
import {
  Box,
  Button,
  Divider,
  Form,
  Row,
  Bold,
  Heading,
  Text,
} from '@metamask/snaps-sdk/jsx';
import { parseUnits } from 'viem';

export const handlePrepareInstallation = async ({
  id,
  event,
  selectedSkillId,
  extractedRunType,
  userAddress,
  smartAccountAddress,
}: {
  id: string;
  event: any;
  selectedSkillId: string;
  extractedRunType: string;
  userAddress: string;
  smartAccountAddress: string;
}) => {
  try {
    const formVals = event.value as Record<string, any>;
    const rawOutputToken = formVals?.['param-output-token'];
    const rawAmountUsdc = formVals?.['param-amount-usdc'];
    const rawSpendMode = formVals?.['param-spend-mode'];
    const rawAllocation = formVals?.['param-allocation'];
    const rawDailyLimit = formVals?.['param-daily-limit'];

    const validateNumberInput = (value: any, fieldName: string) => {
      if (value !== undefined && value !== null && value !== '') {
        const parsed = Number(value);
        if (isNaN(parsed) || parsed <= 0) {
          throw new Error(
            `Input tidak valid! Kolom [${fieldName}] harus berupa angka positif dan tidak boleh mengandung huruf.`,
          );
        }
      }
    };
    validateNumberInput(rawAmountUsdc, 'Amount USDC');
    validateNumberInput(rawAllocation, 'Allocation');
    validateNumberInput(rawDailyLimit, 'Daily Spend Limit');
    console.log(formVals);
    let params: Record<string, any> = {};
    if (extractedRunType == 'cron') {
      params.outputToken = formVals?.['param-output-token'];
      if (rawAmountUsdc) {
        params.amountUsdc = parseUnits(rawAmountUsdc, 6).toString();
      }
    }
    if (extractedRunType == 'event-trigger') {
      params.outputToken = rawOutputToken;
      params.spendMode = rawSpendMode;
     if (rawAllocation) {
       if (rawSpendMode === 'fixed') {
         params.amountPerRun = parseUnits(rawAllocation, 6).toString();
       }
       if (
         rawSpendMode === 'percent-of-inbound'
       ) {
         params.percentOfInboundBps = Math.round(
           Number(rawAllocation) * 100,
         ).toString();
       }
     }

      if (rawDailyLimit) {
        params.dailySpendLimit = parseUnits(rawDailyLimit, 6).toString();
      }
    }

    const body = {
      skillId: selectedSkillId,
      userAddress: userAddress,
      smartAccountAddress: smartAccountAddress,
      parameters: params,
    };

    const resp = await prepareInstallation(body);
    console.log('prepareInstallation response:', resp);
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: {
          pendingInstallation: {
            resp,
            parameters: body.parameters,
          } as any,
        },
      },
    });
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>DCA Robot Activation 🤖</Heading>
            <Text>
              The installation payload has been prepared. Please review the
              automation delegation rules below before activation:
            </Text>
            <Divider />
            {/* DETAIL DELEGASI MENGGUNAKAN ROW AGAR RAPI KIRI-KANAN */}
            <Box>
              <Row label="Smart Account">
                <Text>
                  <Bold>
                    {`${resp.delegation.delegator.slice(0, 6)}...${resp.delegation.delegator.slice(-4)}`}
                  </Bold>
                </Text>
              </Row>

              <Row label="Bot Executor">
                <Text>
                  {`${resp.executorAddress.slice(0, 6)}...${resp.executorAddress.slice(-4)}`}
                </Text>
              </Row>

              <Row label="Network">
                <Text>
                  <Bold>Base Sepolia</Bold> ({resp.chainId.toString()})
                </Text>
              </Row>

              <Row label="Security Constraints">
                <Text>
                  <Bold>{resp.delegation.caveats.length.toString()}</Bold>{' '}
                  Active Rules
                </Text>
              </Row>
            </Box>
            <Divider />
            {/* INFORMASI NOTICE DIBUAT AGAR LEBIH MENCOLOK */}
            <Text>
              <Bold>Notice:</Bold> Clicking the button below will prompt a
              secure cryptographic signature request. This authorization is{' '}
              <Bold>gasless</Bold> and grants the permission to execute swaps
              strictly within the defined constraints.
            </Text>
            <Form name={`sign-delegation-form:${resp.skillId}`}>
              <Button type="submit" variant="primary">
                Sign and Activate Robot 🚀
              </Button>
            </Form>
          </Box>
        ),
      },
    });
  } catch (e: any) {
    console.error('prepareInstallation error', e);
    const status = e?.response?.status;
    let errorMsg = '';
    if (status === 409) {
      // Conflict: skill already installed
      errorMsg = e?.response?.data?.message ?? 'Skill already installed.';
    } else {
      errorMsg = e?.response?.data?.message ?? e?.message ?? 'Unexpected error';
    }
    // Show error UI to the user
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Installation Error</Heading>
            <Text>{errorMsg}</Text>
          </Box>
        ),
      },
    });
  }
};
