import { getExplorerUrl, NETWORK_NAMES } from './networkConfig';

export const shortenAddress = (
  address: string,
  chars = 4,
): string => {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const formatTokenAmount = (
  raw: string | number | undefined | null,
  decimals = 6,
): string => {
  if (raw === undefined || raw === null) return 'N/A';
  const num = Number(raw) / 10 ** decimals;
  if (Number.isNaN(num)) return 'N/A';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
};

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

export const getExplorerTxUrl = (
  chainId: number,
  txHash: string,
): string => {
  const explorerUrl = getExplorerUrl(chainId) || 'https://sepolia.basescan.org';
  return `${explorerUrl}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (
  chainId: number,
  address: string,
): string => {
  const explorerUrl = getExplorerUrl(chainId) || 'https://sepolia.basescan.org';
  return `${explorerUrl}/address/${address}`;
};

export const getNetworkName = (chainId: number): string =>
  NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES] ?? `Chain ${chainId}`;

export const parseMaybeJson = (
  str: string | undefined | null,
): string | Record<string, unknown> => {
  if (!str) return '';
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

export const frequencyToCron = (
  every: number,
  unit: 'hours' | 'days' | 'weeks',
): string => {
  const clamped = Math.max(1, Math.floor(every));
  switch (unit) {
    case 'hours':
      return `0 */${clamped} * * *`;
    case 'days':
      return `0 0 */${clamped} * *`;
    case 'weeks':
      return `0 0 * * ${clamped % 7}`;
    default:
      return `0 */${clamped} * * *`;
  }
};

export const formatExecutionStatus = (status: string): string => {
  switch (status) {
    case 'success':
      return 'Success';
    case 'failed':
      return 'Failed';
    case 'skipped':
      return 'Skipped';
    case 'pending':
      return 'Pending';
    case 'submitted':
      return 'Submitted';
    case 'confirmed':
      return 'Confirmed';
    default:
      return status;
  }
};

export const statusEmoji = (status: string): string => {
  switch (status) {
    case 'active':
      return '✅';
    case 'paused':
      return '⏸️';
    case 'revoked':
      return '❌';
    case 'pending':
      return '⏳';
    case 'failed':
      return '❌';
    case 'success':
      return '✅';
    case 'skipped':
      return '⚠️';
    default:
      return '•';
  }
};
