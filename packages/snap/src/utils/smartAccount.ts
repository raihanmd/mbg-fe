import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { baseSepolia } from 'viem/chains'; // Pakai baseSepolia sesuai chainId 84532 kamu
import {
  Implementation,
  toMetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit';

export const getSmartAccountAddressInSnap = async () => {
  // 1. Setup Public Client (Sama seperti frontend, tapi pakai RPC Base Sepolia)
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'), // Gunakan RPC public Base Sepolia
  });

  // 2. Setup Wallet Client (Gunakan global 'ethereum' milik Snap runtime)
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(ethereum as any), // 👈 KUNCINYA DI SINI (ethereum global, bukan window.ethereum)
  });

  // 3. Ambil alamat EOA (Signer) utama dari MetaMask
  // Di Snap, gunakan requestAccounts agar di-approve oleh manifest ethereum-provider
  const [eoaAddress] = await walletClient.requestAddresses();

  if (!eoaAddress) {
    throw new Error('Gagal mendapatkan alamat EOA Signer.');
  }

  // 4. Hitung Smart Account (SCA) secara Counterfactual
  const smartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [eoaAddress, [], [], []],
    deploySalt: '0x',
    signer: { walletClient },
  });

  // Ambil alamat Smart Account yang berhasil di-compute secara lokal
  const smartAccountAddress = smartAccount.address;

  return {
    userAddress: eoaAddress,
    smartAccountAddress: smartAccountAddress,
  };
};
