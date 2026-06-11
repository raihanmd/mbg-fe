import { createPublicClient, http } from 'viem';
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
import type { Chain } from 'viem';
import { getRpcUrl } from './networkConfig';

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

export const checkDeployed = async (
  address: string,
  chainId = 84532,
): Promise<boolean> => {
  const viemChain = CHAIN_ID_TO_VIEM_CHAIN[chainId];
  if (!viemChain) {
    return false;
  }

  const rpcUrl = getRpcUrl(chainId);
  if (!rpcUrl) {
    return false;
  }

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(rpcUrl),
  });

  const code = await publicClient.getCode({
    address: address as `0x${string}`,
  });
  return code !== undefined && code !== '0x';
};