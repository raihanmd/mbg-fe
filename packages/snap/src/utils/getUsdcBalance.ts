import { createPublicClient, http, erc20Abi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getUsdcAddress } from './networkConfig';

/**
 * Mengambil saldo token USDC dalam bentuk string unit atom (raw BigInt string)
 */
export const getUsdcBalance = async (
  address: string,
  chainId: number,
): Promise<string> => {
  const contractAddress = getUsdcAddress(chainId);
  if (!contractAddress) {
    throw new Error(`USDC address not configured for chain ${chainId}`);
  }

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'), 
  });

  try {
    const balanceResult = await publicClient.readContract({
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });

    return balanceResult.toString();
  } catch (error) {
    console.error('Error saat ambil saldo via Viem:', error);
    return '0'; 
  }
};
