import { createPublicClient, http, type Hex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { isContractDeployed } from '@metamask/smart-accounts-kit/contracts';
import type { MetaMaskSmartAccount } from './smartAccount';
import type { DeployAndExecutePayload } from '../api/pimlico';

const RPC_URL = 'https://sepolia.base.org';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

export const checkDeployed = async (address: string): Promise<boolean> => {
  return isContractDeployed({
    client: publicClient,
    contractAddress: address as `0x${string}`,
  });
};

export const buildDeploymentPayload = async (
  smartAccount: MetaMaskSmartAccount,
): Promise<DeployAndExecutePayload> => {
  const factoryArgs = await smartAccount.getFactoryArgs();

  if (!factoryArgs || !factoryArgs.factory || !factoryArgs.factoryData) {
    throw new Error('Failed to get factory arguments for smart account deployment');
  }

  const initCode = (factoryArgs.factory + factoryArgs.factoryData.slice(2)) as Hex;
  const callData = await smartAccount.encodeCalls([{ to: smartAccount.address }]);

  return {
    sender: smartAccount.address,
    initCode,
    callData,
  };
};

export type DeploymentParts = {
  sender: `0x${string}`;
  factory: `0x${string}`;
  factoryData: `0x${string}`;
  callData: `0x${string}`;
  initCode: `0x${string}`;
};

export const buildDeploymentParts = async (
  smartAccount: MetaMaskSmartAccount,
): Promise<DeploymentParts> => {
  const factoryArgs = await smartAccount.getFactoryArgs();

  if (!factoryArgs || !factoryArgs.factory || !factoryArgs.factoryData) {
    throw new Error('Failed to get factory arguments for smart account deployment');
  }

  const initCode = (factoryArgs.factory + factoryArgs.factoryData.slice(2)) as Hex;
  const callData = await smartAccount.encodeCalls([{ to: smartAccount.address }]);

  return {
    sender: smartAccount.address,
    factory: factoryArgs.factory,
    factoryData: factoryArgs.factoryData,
    callData,
    initCode,
  };
};