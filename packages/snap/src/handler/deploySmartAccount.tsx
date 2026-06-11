import { Box, Button, Heading, Text, Divider, Copyable } from '@metamask/snaps-sdk/jsx';
import { createBundlerClient, createPaymasterClient } from 'viem/account-abstraction';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getSmartAccount } from '../utils/smartAccount';

const PIMLICO_URL = 'https://api.pimlico.io/v2/base-sepolia/rpc?apikey=pim_6nVf8zJFiq6mdBjgPTHCFf';

const getPimlicoBundlerClient = () => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  const paymasterClient = createPaymasterClient({
    transport: http(PIMLICO_URL),
  });

  return createBundlerClient({
    client: publicClient,
    transport: http(PIMLICO_URL),
    paymaster: paymasterClient,
    paymasterContext: {
      sponsorshipPolicyId: 'sp_milky_cassandra_nova',
    },
  });
};

export const handleDeploySmartAccount = async ({ id }: { id: string }) => {
  try {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Deploying Smart Account</Heading>
            <Text>Deploying smart account to Base Sepolia. Please wait...</Text>
          </Box>
        ),
      },
    });

    const { smartAccount } = await getSmartAccount();
    const bundlerClient = getPimlicoBundlerClient();

    // sendUserOperation handles everything:
    // 1. Gets factory args from smart account (for deployment if needed)
    // 2. Encodes calls into callData
    // 3. Gets paymaster stub data (pm_getPaymasterStubData)
    // 4. Estimates gas (eth_estimateUserOperationGas)
    // 5. Gets real paymaster data (pm_getPaymasterData)
    // 6. Signs with the smart account's signUserOperation (MetaMask wallet)
    // 7. Sends to bundler (eth_sendUserOperation)
    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [{ to: smartAccount.address, value: 0n, data: '0x' }],
      maxFeePerGas: 2_000_000_000n,
      maxPriorityFeePerGas: 300_000_000n,
    });

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Waiting for Confirmation</Heading>
            <Text>Waiting for chain confirmation...</Text>
            <Copyable value={userOpHash} />
          </Box>
        ),
      },
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash });

    const state = (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as Record<string, unknown> | null;

    const blockNumber = receipt.receipt.blockNumber;

    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: {
          ...(state ?? {}),
          smartAccountDeployed: true,
          blockNumber: blockNumber?.toString() ?? 'N/A',
        },
      },
    });

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Smart Account Deployed</Heading>
            <Text>Your smart account has been successfully deployed.</Text>
            {receipt.receipt.transactionHash && (
              <Box>
                <Divider />
                <Copyable value={receipt.receipt.transactionHash} />
              </Box>
            )}
            <Divider />
            <Button name="nav:home" variant="primary">
              Back to Home
            </Button>
          </Box>
        ),
      },
    });
  } catch (error: any) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Deployment Failed</Heading>
            <Text>An error occurred during deployment.</Text>
            <Text color="muted">{error?.message ?? 'Unknown error'}</Text>
            <Divider />
            <Button name="nav:deploy-account" variant="primary">
              Retry Deployment
            </Button>
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
  }
};