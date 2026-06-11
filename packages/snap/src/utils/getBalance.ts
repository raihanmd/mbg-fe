import { createPublicClient, erc20Abi, formatEther, formatUnits, http } from 'viem';
import { baseSepolia } from 'viem/chains';

/** USDC contract address on Base Sepolia (6 decimals). */
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

const USDC_DECIMALS = 6;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

/**
 * Format a numeric value with 2-6 decimal places using locale-aware formatting.
 */
const formatBalance = (value: number): string =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

/**
 * Get the ETH balance for an address on Base Sepolia.
 * Returns a human-readable string (e.g. "0.05").
 * Returns "0.00" on error.
 */
export const getEthBalance = async (address: string): Promise<string> => {
  try {
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    });
    const eth = formatEther(balance);
    return formatBalance(Number(eth));
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0.00';
  }
};

/**
 * Get the USDC balance for an address on Base Sepolia.
 * Returns a human-readable string (e.g. "1234.56").
 * Returns "0.00" on error.
 */
export const getUsdcBalance = async (address: string): Promise<string> => {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });
    const humanReadable = formatUnits(balance, USDC_DECIMALS);
    return formatBalance(Number(humanReadable));
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return '0.00';
  }
};

/**
 * Get both ETH and USDC balances for an address on Base Sepolia.
 * Both values are returned as human-readable strings.
 * Individual balance failures return "0.00".
 */
export const getBalances = async (
  address: string,
): Promise<{ eth: string; usdc: string }> => {
  const [eth, usdc] = await Promise.all([
    getEthBalance(address),
    getUsdcBalance(address),
  ]);
  return { eth, usdc };
};
