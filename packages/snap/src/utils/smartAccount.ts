import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  Implementation,
  toMetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit';

import type { SmartAccount } from 'viem/account-abstraction';

export type MetaMaskSmartAccount = SmartAccount & {
  getFactoryArgs: () => Promise<{
    factory: `0x${string}`;
    factoryData: `0x${string}`;
  }>;
  encodeCalls: (calls: readonly { to: `0x${string}`; value?: bigint; data?: `0x${string}` }[]) => Promise<`0x${string}`>;
  isDeployed: () => Promise<boolean>;
};

export const getSmartAccount = async (): Promise<{
  eoaAddress: `0x${string}`;
  smartAccount: MetaMaskSmartAccount;
  walletClient: ReturnType<typeof createWalletClient>;
}> => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  const tempWalletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(ethereum as any),
  });

  const [eoaAddress] = await tempWalletClient.requestAddresses();

  if (!eoaAddress) {
    throw new Error('Failed to get EOA signer address.');
  }

  const walletClient = createWalletClient({
    chain: baseSepolia,
    account: eoaAddress,
    transport: custom(ethereum as any),
  });

  const smartAccount = (await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [eoaAddress, [], [], []],
    deploySalt:
      '0x0000000000000000000000000000000000000000000000000000000000000887',
    signer: { walletClient },
  })) as MetaMaskSmartAccount;

  return { eoaAddress, smartAccount, walletClient };
};

export const getSmartAccountAddressInSnap = async () => {
  const { eoaAddress, smartAccount } = await getSmartAccount();
  return {
    userAddress: eoaAddress,
    smartAccountAddress: smartAccount.address,
  };
};