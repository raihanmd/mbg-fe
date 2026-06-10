import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { baseSepolia } from 'viem/chains'; // Pakai baseSepolia sesuai chainId 84532 kamu
import {
  Implementation,
  toMetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit';

export const getSmartAccountAddressInSnap = async () => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(ethereum as any),
  });

  const [eoaAddress] = await walletClient.requestAddresses();

  if (!eoaAddress) {
    throw new Error('Gagal mendapatkan alamat EOA Signer.');
  }

  const smartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [eoaAddress, [], [], []],
    deploySalt:
      '0x0000000000000000000000000000000000000000000000000000000000000887', // We ensure that newly created Smart Acc is Fresh and we can make sure to compatible with Metamask Delegation Framework
    signer: { walletClient },
  });

  const smartAccountAddress = smartAccount.address;

  return {
    userAddress: eoaAddress,
    smartAccountAddress: smartAccountAddress,
  };
};
