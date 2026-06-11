import { Box, Button, Heading, Text, Section, Row, Divider, Copyable } from '@metamask/snaps-sdk/jsx';
import { createBundlerClient, createPaymasterClient } from 'viem/account-abstraction';
import { createPublicClient, http, encodeFunctionData, erc20Abi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getSmartAccount } from '../utils/smartAccount';

const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';
const USDC_DECIMALS = 6;
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

export const handleWithdrawFunds = async ({
  id,
  token,
  userAddress,
  smartAccountAddress,
}: {
  id: string;
  token: 'eth' | 'weth' | 'usdc';
  userAddress: `0x${string}`;
  smartAccountAddress: `0x${string}`;
}): Promise<void> => {
  try {
    // Phase check — determine if this is the confirmation or execution step
    const state = (await snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as Record<string, unknown> | null;

    const pendingWithdrawal = state?.pendingWithdrawal as
      | { token: string }
      | undefined;

    if (pendingWithdrawal) {
      // ── Phase 2: Execute withdrawal ────────────────────────────────

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Box>
              <Heading>Processing Withdrawal</Heading>
              <Text>
                Withdrawing {token.toUpperCase()} from smart account. Please
                wait...
              </Text>
            </Box>
          ),
        },
      });

      // Clear pending state immediately to prevent double-execution
      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: { ...(state ?? {}), pendingWithdrawal: undefined },
        },
      });

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http('https://sepolia.base.org'),
      });

      const { smartAccount } = await getSmartAccount();
      const bundlerClient = getPimlicoBundlerClient();

      let calls: { to: `0x${string}`; value: bigint; data: `0x${string}` }[];

      if (token === 'eth') {
        const balance = await publicClient.getBalance({
          address: smartAccountAddress,
        });

        if (balance === 0n) {
          await snap.request({
            method: 'snap_updateInterface',
            params: {
              id,
              ui: (
                <Box>
                  <Heading>Withdrawal Failed</Heading>
                  <Text color="error">No ETH balance to withdraw</Text>
                  <Divider />
                  <Button name="nav:home">Back to Home</Button>
                </Box>
              ),
            },
          });
          return;
        }

        calls = [{ to: userAddress, value: balance, data: '0x' }];
      } else if (token === 'weth') {
        const balance = await publicClient.readContract({
          address: WETH_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [smartAccountAddress],
        });

        if (balance === 0n) {
          await snap.request({
            method: 'snap_updateInterface',
            params: {
              id,
              ui: (
                <Box>
                  <Heading>Withdrawal Failed</Heading>
                  <Text color="error">No WETH balance to withdraw</Text>
                  <Divider />
                  <Button name="nav:home">Back to Home</Button>
                </Box>
              ),
            },
          });
          return;
        }

        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [userAddress, balance],
        });

        calls = [{ to: WETH_ADDRESS, value: 0n, data: transferData }];
      } else {
        const balance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [smartAccountAddress],
        });

        if (balance === 0n) {
          await snap.request({
            method: 'snap_updateInterface',
            params: {
              id,
              ui: (
                <Box>
                  <Heading>Withdrawal Failed</Heading>
                  <Text color="error">No USDC balance to withdraw</Text>
                  <Divider />
                  <Button name="nav:home">Back to Home</Button>
                </Box>
              ),
            },
          });
          return;
        }

        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [userAddress, balance],
        });

        calls = [{ to: USDC_ADDRESS, value: 0n, data: transferData }];
      }

      const userOpHash = await bundlerClient.sendUserOperation({
        account: smartAccount,
        calls,
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

      const receipt =
        await bundlerClient.waitForUserOperationReceipt({
          hash: userOpHash,
        });

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Box>
              <Heading>Withdrawal Successful</Heading>
              <Text>
                {token.toUpperCase()} withdrawn successfully
              </Text>
              <Section>
                <Row label="To">
                  <Text>{`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}</Text>
                </Row>
              </Section>
              <Divider />
              {receipt.receipt.transactionHash && (
                <Copyable value={receipt.receipt.transactionHash} />
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
      // ── Phase 1: Show confirmation UI ──────────────────────────────

      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: {
            ...(state ?? {}),
            pendingWithdrawal: { token },
          },
        },
      });

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: (
            <Box>
              <Button name="nav:home">← Back to Home</Button>
              <Divider />
              <Heading>Withdraw Funds</Heading>
              <Section>
                <Row label="Token">
                  <Text>{token.toUpperCase()}</Text>
                </Row>
                <Row label="From">
                  <Text>{`${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}`}</Text>
                </Row>
                <Row label="To">
                  <Text>{`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}</Text>
                </Row>
                <Row label="Note">
                  <Text>
                    All balance will be withdrawn to your EOA
                  </Text>
                </Row>
              </Section>
              <Button
                name={`confirm-withdraw:${token}`}
                variant="primary"
              >
                Confirm Withdraw
              </Button>
              <Button name="nav:home">Cancel</Button>
            </Box>
          ),
        },
      });
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: (
          <Box>
            <Heading>Withdrawal Failed</Heading>
            <Text color="muted">{message}</Text>
            <Divider />
            <Button name="nav:home">Back to Home</Button>
          </Box>
        ),
      },
    });
  }
};
