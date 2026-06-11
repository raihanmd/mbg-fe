const API_URL = 'http://localhost:4000';
// TODO: Replace with your Pimlico execution key for production
const PIMLICO_EXEC_KEY = '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message ?? errorBody?.error ?? errorMessage;
    } catch (ignored) {
      void ignored;
    }
    throw new Error(errorMessage);
  }
  return (await response.json()) as T;
}

export interface DeployAndExecuteResponse {
  nonce: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  paymaster: string;
  paymasterData: string;
  paymasterVerificationGasLimit: string;
  paymasterPostOpGasLimit: string;
}

export interface SubmitUserOpResponse {
  userOpHash: string;
}

export interface PollReceiptResponse {
  userOpHash: string;
  transactionHash: string;
  success: boolean;
  blockNumber: number;
  status: string;
}

/**
 * Phase 1: Estimate gas + get paymaster sponsorship data from backend Pimlico proxy.
 */
export async function deployAndExecute(
  sender: string,
  initCode: string,
  callData: string,
  chainId?: number,
): Promise<DeployAndExecuteResponse> {
  const response = await globalThis.fetch(
    `${API_URL}/pimlico/deploy-and-execute`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pimlico-key': PIMLICO_EXEC_KEY as string,
      },
      body: JSON.stringify({ sender, initCode, callData, chainId }),
    },
  );
  return handleResponse<DeployAndExecuteResponse>(response);
}

/**
 * Phase 2: Submit a fully built and signed UserOp to the backend Pimlico proxy.
 */
export async function submitUserOp(
  userOp: Record<string, unknown>,
  chainId?: number,
): Promise<SubmitUserOpResponse> {
  const response = await globalThis.fetch(
    `${API_URL}/pimlico/submit-user-op`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pimlico-key': PIMLICO_EXEC_KEY as string,
      },
      body: JSON.stringify({ ...userOp, chainId }),
    },
  );
  return handleResponse<SubmitUserOpResponse>(response);
}

/**
 * Phase 3: Poll for UserOperation receipt from the backend Pimlico proxy.
 */
export async function pollReceipt(
  userOpHash: string,
  timeoutMs: number,
  chainId?: number,
): Promise<PollReceiptResponse> {
  const response = await globalThis.fetch(
    `${API_URL}/pimlico/user-operation/poll`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pimlico-key': PIMLICO_EXEC_KEY as string,
      },
      body: JSON.stringify({ userOpHash, timeoutMs, chainId }),
    },
  );
  return handleResponse<PollReceiptResponse>(response);
}