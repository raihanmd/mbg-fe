
import { prepareInstallation } from "../api/installations";
import {
  Box,
  Button,
  Divider,
  Form,
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
  const formVals = event.value as Record<string, any>;
  const rawOutputToken = formVals?.['param-output-token'];
  const rawAmountUsdc = formVals?.['param-amount-usdc'];
  const rawSpendMode = formVals?.['param-spend-mode'];
  const rawAmountPerRun = formVals?.['param-amount-per-run'];
  const rawPercentInbound = formVals?.['param-percent-inbound'];
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
  validateNumberInput(rawAmountPerRun, 'Amount Per Run');
  validateNumberInput(rawPercentInbound, 'Percent Inbound');
  validateNumberInput(rawDailyLimit, 'Daily Spend Limit');
  console.log(formVals);
  let params: Record<string, any> = {};
  if (extractedRunType == 'cron') {
    params.outputToken = formVals?.['param-output-token'];
    if (rawAmountUsdc) {
      params.amountUsdc = parseUnits(rawAmountUsdc, 6).toString(); // Fix typo amoountUsdc
    }
  }
  if (extractedRunType == 'event-trigger') {
    params.outputToken = rawOutputToken;
    params.spendMode = rawSpendMode;
    if (rawSpendMode === 'fixed' && rawAmountPerRun) {
      params.amountPerRun = parseUnits(rawAmountPerRun, 6).toString();
    }

    // Hanya isi percentOfInboundBps jika spendMode-nya adalah percent-of-inbound
    // Serta pastikan dikali 100 (bukan 10000) untuk mengubah % ke Basis Points (bps)
    if (rawSpendMode === 'percent-of-inbound' && rawPercentInbound) {
      params.percentOfInboundBps = Math.round(Number(rawPercentInbound) * 100);
    }

    // Daily spend limit selalu diisi sebagai guardrail (6 desimal)
    if (rawDailyLimit) {
      params.dailySpendLimit = parseUnits(rawDailyLimit, 6).toString();
    }
  }

  const body = {
    skillId: selectedSkillId,
    userAddress: userAddress, // TODO: populate with actual user address
    smartAccountAddress: smartAccountAddress, // TODO: populate with actual smart account address
    parameters: params,
  };
  console.log(body);
  try {
    const resp = await prepareInstallation(body);
    console.log('prepareInstallation response:', resp);
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: {
          pendingInstallation: {
            resp,
            parameters: body.parameters, // Saved safe and sound here
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
            <Heading>DCA Robot Activation</Heading>
            <Text>
              The installation payload has been prepared. Please review the
              automation delegation rules below before activation:
            </Text>

            <Divider />

            <Box>
              <Text>Smart Account (Delegator):</Text>
              <Text>{resp.delegation.delegator}</Text>

              <Text>Bot Executor (Delegate):</Text>
              <Text>{resp.executorAddress}</Text>

              <Text>Network Chain ID:</Text>
              <Text>{resp.chainId.toString()} (Base Sepolia)</Text>

              <Text>Security Constraints:</Text>
              <Text>{resp.delegation.caveats.length.toString()} Active Caveat Rules</Text>
            </Box>

            <Divider />

            <Text>
              Notice: Clicking the button below will prompt a secure
              cryptographic signature request. This authorization is gasless and
              grants the AI permission to execute swaps strictly within the
              defined caveat constraints.
            </Text>

            <Form name={`sign-delegation-form:${resp.skillId}`}>
              <Button type="submit">Sign and Activate</Button>
            </Form>
          </Box>
        ),
      },
    });
  } catch (e: any) {
    throw e;
  }
};
