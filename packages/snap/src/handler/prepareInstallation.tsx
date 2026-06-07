
import { prepareInstallation } from "../api/installations";
import { Box, Text } from "@metamask/snaps-sdk/jsx";
import { getSmartAccountAddressInSnap } from "../utils/smartAccount";

export const handlePrepareInstallation = async ({event, selectedSkillId}: {event: any, selectedSkillId: string}) => {
	const formVals = event.value as Record<string, any>;
	const { userAddress, smartAccountAddress } = await getSmartAccountAddressInSnap();

	let params: Record<string, any> = {}
	if (formVals?.['run-type'] == "cron") {
		params.outputToken = formVals?.['param-output-token']
		params.amoountUsdc = formVals?.['param-amount-usdc']
	}
	if (formVals?.['run-type'] == "event-trigger") {
		params.outputToken = formVals?.['param-output-token']
		params.spendMode = formVals?.['param-spend-mode']
		params.amountPerRun = formVals?.['param-amount-per-run']
		params.percentOfInboundBps = formVals?.['param-percent-inbound']
		params.dailySpendLimit = formVals?.['param-daily-limit']
	}

    const body = {
      skillId: selectedSkillId,
      userAddress: userAddress, // TODO: populate with actual user address
      smartAccountAddress: smartAccountAddress, // TODO: populate with actual smart account address
      parameters: params,
	};
	console.log(body)
    try {
      const resp = await prepareInstallation(body);
      console.log('prepareInstallation response:', resp);
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: (
            <Box>
              <Text>Installation prepared successfully.</Text>
            </Box>
          ),
        },
      });
    } catch (e: any) {
      console.error('prepareInstallation error:', e);
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: (
            <Box>
              <Text>Failed to prepare installation: {e.message}</Text>
            </Box>
          ),
        },
      });
    }
}
