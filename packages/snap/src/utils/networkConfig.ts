import type { Address } from 'viem';

export type ChainId = (typeof SUPPORTED_NETWORKS)[number]['chainId'];

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  pimlicoId: string | null;
  explorerUrl: string;
  usdcAddress: Address;
}

export const PIMLICO_API_KEY = 'pim_6nVf8zJFiq6mdBjgPTHCFf';
export const PIMLICO_SPONSORSHIP_POLICY = 'sp_milky_cassandra_nova';

export const SUPPORTED_NETWORKS = [
  {
    chainId: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    pimlicoId: 'op',
    explorerUrl: 'https://optimistic.etherscan.io',
    usdcAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' as Address,
  },
  {
    chainId: 11155420,
    name: 'Optimism Sepolia',
    rpcUrl: 'https://sepolia.optimism.io',
    pimlicoId: 'op-sepolia',
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    usdcAddress: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7' as Address,
  },
  {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    pimlicoId: 'base',
    explorerUrl: 'https://basescan.org',
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
  },
  {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    pimlicoId: 'base-sepolia',
    explorerUrl: 'https://sepolia.basescan.org',
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    pimlicoId: 'arb',
    explorerUrl: 'https://arbiscan.io',
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address,
  },
  {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    pimlicoId: 'arb-sepolia',
    explorerUrl: 'https://sepolia.arbiscan.io',
    usdcAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as Address,
  },
  {
    chainId: 56,
    name: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    pimlicoId: null,
    explorerUrl: 'https://bscscan.com',
    usdcAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' as Address,
  },
  {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    pimlicoId: null,
    explorerUrl: 'https://testnet.bscscan.com',
    usdcAddress: '0x64544969ed7EBf5f083679233325356EbE738930' as Address,
  },
] as const;

export const NETWORK_NAMES: Record<ChainId, string> = Object.fromEntries(
  SUPPORTED_NETWORKS.map((n) => [n.chainId, n.name]),
) as Record<ChainId, string>;

export const NETWORK_OPTIONS = SUPPORTED_NETWORKS.map((n) => ({
  value: n.chainId.toString(),
  label: n.name,
}));

export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined =>
  SUPPORTED_NETWORKS.find((n) => n.chainId === chainId);

export const getPimlicoUrl = (chainId: number): string | null => {
  const network = getNetworkByChainId(chainId);
  if (!network?.pimlicoId) return null;
  return `https://api.pimlico.io/v2/${network.pimlicoId}/rpc?apikey=${PIMLICO_API_KEY}`;
};

export const getRpcUrl = (chainId: number): string | undefined =>
  getNetworkByChainId(chainId)?.rpcUrl;

export const getUsdcAddress = (chainId: number): Address | undefined =>
  getNetworkByChainId(chainId)?.usdcAddress;

export const getExplorerUrl = (chainId: number): string | undefined =>
  getNetworkByChainId(chainId)?.explorerUrl;