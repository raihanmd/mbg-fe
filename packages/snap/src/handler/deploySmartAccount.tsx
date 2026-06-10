import { Box, Button, Heading, Text, Divider, Copyable } from '@metamask/snaps-sdk/jsx';
import type { Hex } from 'viem';
import { concat, pad, toHex } from 'viem';
import { SIGNABLE_USER_OP_TYPED_DATA } from '@metamask/smart-accounts-kit/utils';
import { deployAndExecute, pollUserOperation, submitUserOp, ENTRY_POINT_V07 } from '../api/pimlico';
import { buildDeploymentParts } from '../utils/deployment';
import { getSmartAccount } from '../utils/smartAccount';

const toHex = (value: bigint): string => '0x' + value.toString(16);

export const handleDeploySmartAccount = async ({
  id,
}: {
  id: string;
}) => {
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

    const { eoaAddress, smartAccount, walletClient } = await getSmartAccount();
    const { sender, factory, factoryData, callData, initCode } =
      await buildDeploymentParts(smartAccount);

    const response = await deployAndExecute({ sender, initCode, callData });

    const userOpWithoutSig = {
      sender: smartAccount.address,
      nonce: BigInt(response.nonce),
      factory: factory as Hex,
      factoryData: factoryData as Hex,
      callData: callData as Hex,
      callGasLimit: BigInt(response.callGasLimit),
      verificationGasLimit: BigInt(response.verificationGasLimit),
      preVerificationGas: BigInt(response.preVerificationGas),
      maxFeePerGas: BigInt(response.maxFeePerGas ?? '0x0'),
      maxPriorityFeePerGas: BigInt(response.maxPriorityFeePerGas ?? '0x0'),
      paymaster: response.paymaster ? (response.paymaster as Hex) : undefined,
      paymasterVerificationGasLimit: response.paymasterVerificationGasLimit
        ? BigInt(response.paymasterVerificationGasLimit)
        : undefined,
      paymasterPostOpGasLimit: response.paymasterPostOpGasLimit
        ? BigInt(response.paymasterPostOpGasLimit)
        : undefined,
      paymasterData: response.paymasterData ? (response.paymasterData as Hex) : undefined,
    };

    // Build packed UserOperation fields for EIP-712 signing
    const accountGasLimits = concat([
      pad(toHex(userOpWithoutSig.verificationGasLimit), { size: 16 }),
      pad(toHex(userOpWithoutSig.callGasLimit), { size: 16 }),
    ]);

    const initCodePacked = concat([factory as Hex, factoryData as Hex]);

    const gasFees = concat([
      pad(toHex(userOpWithoutSig.maxPriorityFeePerGas), { size: 16 }),
      pad(toHex(userOpWithoutSig.maxFeePerGas), { size: 16 }),
    ]);

    const paymasterAndData = userOpWithoutSig.paymaster
      ? concat([
          userOpWithoutSig.paymaster as Hex,
          pad(toHex(userOpWithoutSig.paymasterVerificationGasLimit ?? 0n), { size: 16 }),
          pad(toHex(userOpWithoutSig.paymasterPostOpGasLimit ?? 0n), { size: 16 }),
          (userOpWithoutSig.paymasterData as Hex) ?? '0x',
        ])
      : '0x';

    const signature = await walletClient.signTypedData({
      account: eoaAddress,
      domain: {
        chainId: 84532,
        name: 'HybridDeleGator',
        version: '1',
        verifyingContract: smartAccount.address,
      },
      types: SIGNABLE_USER_OP_TYPED_DATA,
      primaryType: 'PackedUserOperation',
      message: {
        sender: smartAccount.address,
        nonce: userOpWithoutSig.nonce,
        initCode: initCodePacked,
        callData: callData as Hex,
        accountGasLimits,
        preVerificationGas: userOpWithoutSig.preVerificationGas,
        gasFees,
        paymasterAndData,
        entryPoint: ENTRY_POINT_V07,
      },
    });

    const { userOpHash } = await submitUserOp({
      sender: smartAccount.address,
      nonce: toHex(userOpWithoutSig.nonce),
      factory,
      factoryData,
      callData,
      callGasLimit: toHex(userOpWithoutSig.callGasLimit),
      verificationGasLimit: toHex(userOpWithoutSig.verificationGasLimit),
      preVerificationGas: toHex(userOpWithoutSig.preVerificationGas),
      maxFeePerGas: toHex(userOpWithoutSig.maxFeePerGas),
      maxPriorityFeePerGas: toHex(userOpWithoutSig.maxPriorityFeePerGas),
      paymaster: response.paymaster ?? null,
      paymasterVerificationGasLimit: toHex(
        userOpWithoutSig.paymasterVerificationGasLimit ?? 0n,
      ),
      paymasterPostOpGasLimit: toHex(userOpWithoutSig.paymasterPostOpGasLimit ?? 0n),
      paymasterData: response.paymasterData ?? null,
      signature,
      entryPoint: ENTRY_POINT_V07,
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

    const pollResult = await pollUserOperation(userOpHash);

    if (pollResult.success) {
      const state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      })) as Record<string, unknown> | null;

      const blockNumber = pollResult.receipt?.blockNumber ?? 'N/A';

      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: {
            ...(state ?? {}),
            smartAccountDeployed: true,
            blockNumber,
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
              {pollResult.receipt?.transactionHash && (
                <Box>
                  <Divider />
                  <Copyable value={pollResult.receipt.transactionHash} />
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
    } else {
      const errorMsg = pollResult.error ?? 'Unknown error during deployment.';

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Box>
              <Heading>Deployment Failed</Heading>
              <Text>Smart account deployment failed.</Text>
              <Text color="muted">{errorMsg}</Text>
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
  } catch (error: any) {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Deployment Failed</Heading>
            <Text>An error occurred during deployment.</Text>
            <Text color="muted">
              {error?.message ?? 'Unknown error'}
            </Text>
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