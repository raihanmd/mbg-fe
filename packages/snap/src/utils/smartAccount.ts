import { createPublicClient, createWalletClient, custom, http } from 'viem';
import {
  base,
  baseSepolia,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
  bsc,
  bscTestnet,
} from 'viem/chains';
import {
  Implementation,
  toMetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit';

import type { SmartAccount } from 'viem/account-abstraction';
import type { Chain } from 'viem';
import { getRpcUrl } from './networkConfig';

export type MetaMaskSmartAccount = SmartAccount & {
  getFactoryArgs: () => Promise<{
    factory: `0x${string}`;
    factoryData: `0x${string}`;
  }>;
  encodeCalls: (
    calls: readonly {
      to: `0x${string}`;
      value?: bigint;
      data?: `0x${string}`;
    }[],
  ) => Promise<`0x${string}`>;
  isDeployed: () => Promise<boolean>;
};

export type AccountType = '4337' | '7702';

const CHAIN_ID_TO_VIEM_CHAIN: Record<number, Chain> = {
  10: optimism,
  11155420: optimismSepolia,
  8453: base,
  84532: baseSepolia,
  42161: arbitrum,
  421614: arbitrumSepolia,
  56: bsc,
  97: bscTestnet,
};

interface GetSmartAccountParams {
  chainId?: number;
  accountType?: AccountType;
}

export const getSmartAccount = async (
  params: GetSmartAccountParams = {},
): Promise<{
  eoaAddress: `0x${string}`;
  smartAccount: MetaMaskSmartAccount;
  walletClient: ReturnType<typeof createWalletClient>;
}> => {
  const chainId = params.chainId ?? 84532;
  const accountType = params.accountType ?? '4337';

  const viemChain = CHAIN_ID_TO_VIEM_CHAIN[chainId];
  if (!viemChain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const rpcUrl = getRpcUrl(chainId);
  if (!rpcUrl) {
    throw new Error(`No RPC URL configured for chain ID: ${chainId}`);
  }

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(rpcUrl),
  });

  const tempWalletClient = createWalletClient({
    chain: viemChain,
    transport: custom(ethereum as any),
  });

  const [eoaAddress] = await tempWalletClient.requestAddresses();

  if (!eoaAddress) {
    throw new Error('Failed to get EOA signer address.');
  }

  const walletClient = createWalletClient({
    chain: viemChain,
    account: eoaAddress,
    transport: custom(ethereum as any),
  });

  let smartAccount: MetaMaskSmartAccount;

  if (accountType === '7702') {
    smartAccount = (await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Stateless7702,
      address: eoaAddress,
      signer: { walletClient },
    })) as MetaMaskSmartAccount;
  } else {
    smartAccount = (await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Hybrid,
      deployParams: [eoaAddress, [], [], []],
      deploySalt:
        '0x0000000000000000000000000000000000000000000000000000000000000887',
      signer: { walletClient },
    })) as MetaMaskSmartAccount;
  }

  return { eoaAddress, smartAccount, walletClient };
};

interface GetSmartAccountAddressInSnapParams {
  chainId?: number;
  accountType?: AccountType;
}

export const getSmartAccountAddressInSnap = async (
  params: GetSmartAccountAddressInSnapParams = {},
) => {
  const { eoaAddress, smartAccount } = await getSmartAccount(params);
  return {
    userAddress: eoaAddress,
    smartAccountAddress: smartAccount.address,
  };
};

/** Persists the user's chain and account type selection to Snap state. */
export const persistSelection = async (
  chainId: number,
  accountType: AccountType,
): Promise<void> => {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as Record<string, unknown> | null;

  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: {
        ...(state ?? {}),
        selectedChainId: chainId,
        accountType,
      },
    },
  });
};

/** Reads the selected chain ID from Snap state. Falls back to 84532 (Base Sepolia). */
export const getSelectedChainId = async (): Promise<number> => {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as Record<string, unknown> | null;

  const stored = state?.selectedChainId;
  if (typeof stored === 'number') {
    return stored;
  }
  if (typeof stored === 'string') {
    const parsed = Number(stored);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return 84532;
};

/** Reads the selected account type from Snap state. Falls back to '4337'. */
export const getSelectedAccountType = async (): Promise<AccountType> => {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as Record<string, unknown> | null;

  const stored = state?.accountType;
  if (stored === '4337' || stored === '7702') {
    return stored;
  }
  return '4337';
};