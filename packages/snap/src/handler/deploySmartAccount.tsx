import { Box, Button, Heading, Text, Divider, Copyable, Link } from '@metamask/snaps-sdk/jsx';
import { createPublicClient, http } from 'viem';
import {
  getSmartAccount,
  getSelectedChainId,
  getSelectedAccountType,
} from '../utils/smartAccount';
import { getNetworkByChainId, getRpcUrl } from '../utils/networkConfig';
import { getExplorerTxUrl, shortenAddress } from '../utils/format';
import {
  deployAndExecute,
  submitUserOp,
  pollReceipt,
} from '../api/pimlico';

export const handleDeploySmartAccount = async ({ id }: { id: string }) => {
  const chainId = await getSelectedChainId();
  const accountType = await getSelectedAccountType();
  const network = getNetworkByChainId(chainId);
  const networkName = network?.name ?? `Chain ${chainId}`;
  const pimlicoId = network?.pimlicoId;

  if (!pimlicoId) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Deployment Not Available</Heading>
            <Text>
              Smart account deployment is only available on Optimism, Base, and
              Arbitrum. {networkName} (BSC) is not supported for deployment.
            </Text>
            <Divider />
            <Button name="nav:home" variant="primary">
              Back to Home
            </Button>
          </Box>
        ),
      },
    });
    return;
  }

  try {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Deploying Smart Account</Heading>
            <Text>
              Deploying smart account to {networkName}. Please wait...
            </Text>
          </Box>
        ),
      },
    });

    const { smartAccount, walletClient } = await getSmartAccount({
      chainId,
      accountType,
    });

    const publicClient = createPublicClient({
      chain: walletClient.chain,
      transport: http(getRpcUrl(chainId)),
    });

    const initCode = (await (smartAccount as any).getInitCode?.()) ?? '0x';

    const callData = await smartAccount.encodeCalls([
      { to: smartAccount.address, value: 0n, data: '0x' },
    ]);

    const deployResult = await deployAndExecute(
      smartAccount.address,
      initCode,
      callData,
      chainId,
    );

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await publicClient.estimateFeesPerGas();

    const userOp: Record<string, unknown> = {
      sender: smartAccount.address,
      nonce: BigInt(deployResult.nonce),
      callData,
      callGasLimit: BigInt(deployResult.callGasLimit),
      verificationGasLimit: BigInt(deployResult.verificationGasLimit),
      preVerificationGas: BigInt(deployResult.preVerificationGas),
      maxFeePerGas: maxFeePerGas ?? 2_000_000_000n,
      maxPriorityFeePerGas: maxPriorityFeePerGas ?? 300_000_000n,
      paymaster: deployResult.paymaster,
      paymasterData: deployResult.paymasterData,
      paymasterVerificationGasLimit: BigInt(
        deployResult.paymasterVerificationGasLimit,
      ),
      paymasterPostOpGasLimit: BigInt(
        deployResult.paymasterPostOpGasLimit,
      ),
      signature: '0x',
    };

    if (initCode && initCode !== '0x') {
      userOp.factory = initCode.slice(0, 42);
      userOp.factoryData = `0x${initCode.slice(42)}`;
    }

    userOp.signature = await smartAccount.signUserOperation(userOp as any);

    const { userOpHash } = await submitUserOp(userOp, chainId);

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

    const receipt = await pollReceipt(userOpHash, 120000, chainId);

    const state = (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as Record<string, unknown> | null;

    const blockNumber = receipt.blockNumber;

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

    const txHash = receipt.transactionHash;

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Smart Account Deployed</Heading>
            <Text>
              Your smart account has been successfully deployed on{' '}
              {networkName}.
            </Text>
            {txHash ? (
              <Box>
                <Divider />
                <Text>
                  <Link href={getExplorerTxUrl(chainId, txHash)}>
                    {shortenAddress(txHash, 8)}
                  </Link>
                </Text>
                <Copyable value={txHash} />
              </Box>
            ) : null}
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