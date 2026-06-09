import { createPublicClient, http, erc20Abi } from 'viem';
import { baseSepolia } from 'viem/chains';

const USDC_CONTRACTS: Record<number, `0x${string}`> = {
  1: '0xA0b86991c6218b36c1d19d4a2e9eb0cE3606eB48',
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
};

/**
 * Mengambil saldo token USDC dalam bentuk string unit atom (raw BigInt string)
 */
export const getUsdcBalance = async (
  address: string,
  chainId: number,
): Promise<string> => {
  const contractAddress = USDC_CONTRACTS[chainId];
  if (!contractAddress) {
    return '0';
  }

  // 1. Inisialisasi Public Client Viem khusus untuk network target (Base Sepolia)
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'), // Gunakan RPC Base Sepolia resmi
  });

  try {
    // 2. Baca kontrak menggunakan default ERC20 ABI bawaan Viem
    const balanceResult = await publicClient.readContract({
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });

    // Hasilnya berupa BigInt (misal: 15000000n), kita ubah ke string agar aman untuk input value
    return balanceResult.toString();
  } catch (error) {
    console.error('Error saat ambil saldo via Viem:', error);
    return '0'; // Fallback jika user baru atau koneksi RPC bermasalah
  }
};
