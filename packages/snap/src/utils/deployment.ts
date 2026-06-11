import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const RPC_URL = 'https://sepolia.base.org';

export const checkDeployed = async (address: string): Promise<boolean> => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  const code = await publicClient.getCode({
    address: address as `0x${string}`,
  });
  return code !== undefined && code !== '0x';
};