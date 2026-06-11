/**
 * Direct Pimlico RPC client for ERC-4337 EntryPoint v0.7.
 *
 * Calls Pimlico's bundler/paymaker endpoints directly from the Snap,
 * eliminating the backend proxy dependency.
 *
 * All UserOperation fields are hex strings (Pimlico RPC format for v0.7).
 * The v0.7 userOp uses `factory`/`factoryData` (NOT `initCode`).
 */

import { getPimlicoUrl, PIMLICO_SPONSORSHIP_POLICY } from './networkConfig';

// ── Constants ──────────────────────────────────────────────────────────────

/** EntryPoint v0.7 address */
export const ENTRYPOINT_V07 = '0x0000000071727De22E5E9d8BAf0edAc6f37da032' as const;

/** ERC-4337 "dummy" signature for gas estimation & sponsorship */
const DUMMY_SIGNATURE =
  '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c' as const;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Convert a bigint to a hex string (e.g. 100n → "0x64"). */
export function bigintToHex(value: bigint): string {
  return `0x${value.toString(16)}`;
}

/** Convert a hex string to bigint (e.g. "0x64" → 100n). */
export function hexToBigint(value: string): bigint {
  return BigInt(value);
}

// ── Core RPC ───────────────────────────────────────────────────────────────

interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Send a JSON-RPC request to the Pimlico endpoint for the given chain.
 * Uses `globalThis.fetch` (required in Snap environment).
 */
async function pimlicoRpc<T>(
  chainId: number,
  method: string,
  params: unknown[],
): Promise<T> {
  const url = getPimlicoUrl(chainId);
  if (!url) {
    throw new Error(`No Pimlico URL configured for chain ID ${chainId}`);
  }

  const body = {
    jsonrpc: '2.0' as const,
    id: Date.now(),
    method,
    params,
  };

  const response = await globalThis.fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `Pimlico RPC HTTP error: ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as JsonRpcResponse<T>;

  if (json.error) {
    throw new Error(
      `Pimlico RPC error [${json.error.code}]: ${json.error.message}`,
    );
  }

  if (json.result === undefined) {
    throw new Error('Pimlico RPC returned no result');
  }

  return json.result;
}

// ── Gas Estimation ──────────────────────────────────────────────────────────

export interface GasEstimation {
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
}

/**
 * Estimate gas for a UserOperation via `eth_estimateUserOperationGas`.
 *
 * The userOp should have placeholder gas values (e.g. "0x0") and a dummy
 * signature. Returns the estimated gas limits.
 */
export async function estimateUserOperationGas(
  chainId: number,
  userOp: Record<string, unknown>,
): Promise<GasEstimation> {
  const result = await pimlicoRpc<{
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
  }>(chainId, 'eth_estimateUserOperationGas', [userOp, ENTRYPOINT_V07]);

  return {
    callGasLimit: hexToBigint(result.callGasLimit),
    verificationGasLimit: hexToBigint(result.verificationGasLimit),
    preVerificationGas: hexToBigint(result.preVerificationGas),
  };
}

// ── Sponsorship ─────────────────────────────────────────────────────────────

export interface SponsorshipResult {
  paymaster: string;
  paymasterData: string;
  paymasterVerificationGasLimit: string;
  paymasterPostOpGasLimit: string;
  /** Sponsorship also returns updated gas estimates */
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
}

/**
 * Sponsor a UserOperation via `pm_sponsorUserOperation`.
 *
 * Passes the sponsorship policy ID in the options parameter.
 * Returns paymaster fields and updated gas estimates.
 */
export async function sponsorUserOperation(
  chainId: number,
  userOp: Record<string, unknown>,
): Promise<SponsorshipResult> {
  const result = await pimlicoRpc<SponsorshipResult>(
    chainId,
    'pm_sponsorUserOperation',
    [
      userOp,
      ENTRYPOINT_V07,
      { sponsorshipPolicyId: PIMLICO_SPONSORSHIP_POLICY },
    ],
  );

  return result;
}

// ── Submit ───────────────────────────────────────────────────────────────────

/**
 * Submit a signed UserOperation via `eth_sendUserOperation`.
 * Returns the userOpHash for tracking.
 */
export async function sendUserOperation(
  chainId: number,
  userOp: Record<string, unknown>,
): Promise<string> {
  return pimlicoRpc<string>(chainId, 'eth_sendUserOperation', [
    userOp,
    ENTRYPOINT_V07,
  ]);
}

// ── Receipt ─────────────────────────────────────────────────────────────────

export interface UserOperationReceipt {
  userOpHash: string;
  sender: string;
  nonce: string;
  success: boolean;
  receipt: {
    transactionHash: string;
    blockNumber: string;
    status: string;
  } | null;
}

/**
 * Get the receipt for a UserOperation via `eth_getUserOperationReceipt`.
 * Returns null if the operation has not been included yet.
 */
export async function getUserOperationReceipt(
  chainId: number,
  userOpHash: string,
): Promise<UserOperationReceipt | null> {
  return pimlicoRpc<UserOperationReceipt | null>(
    chainId,
    'eth_getUserOperationReceipt',
    [userOpHash],
  );
}

/**
 * Poll for a UserOperation receipt until it is available or timeout is reached.
 * Polls every 2 seconds.
 */
export async function waitForUserOperationReceipt(
  chainId: number,
  userOpHash: string,
  timeoutMs = 120_000,
): Promise<UserOperationReceipt> {
  const pollInterval = 2_000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const receipt = await getUserOperationReceipt(chainId, userOpHash);
    if (receipt) {
      return receipt;
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(
    `Timed out waiting for UserOperation receipt (hash: ${userOpHash})`,
  );
}

// ── UserOp Builder Helpers ─────────────────────────────────────────────────

/**
 * Build a partial v0.7 UserOperation with placeholder values for gas estimation.
 *
 * Uses `factory`/`factoryData` (v0.7 format) instead of `initCode` (v0.6).
 * All values are hex strings as required by the Pimlico RPC.
 */
export function buildPartialUserOp(params: {
  sender: string;
  nonce: string;
  factory: string | undefined;
  factoryData: string | undefined;
  callData: string;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}): Record<string, unknown> {
  return {
    sender: params.sender,
    nonce: params.nonce,
    ...(params.factory ? { factory: params.factory } : {}),
    ...(params.factoryData ? { factoryData: params.factoryData } : {}),
    callData: params.callData,
    // Placeholder gas values — will be filled by estimation
    callGasLimit: '0x0',
    verificationGasLimit: '0x0',
    preVerificationGas: '0x0',
    maxFeePerGas: bigintToHex(params.maxFeePerGas),
    maxPriorityFeePerGas: bigintToHex(params.maxPriorityFeePerGas),
    // No paymaster fields yet — will be filled by sponsorship
    // Omit paymaster fields entirely; Pimlico will ignore them in estimation
    signature: DUMMY_SIGNATURE,
  };
}

export { DUMMY_SIGNATURE };
