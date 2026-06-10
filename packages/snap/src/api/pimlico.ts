const API_URL = process.env.API_URL;

const PIMLICO_API_KEY = 'b0bc742e-6741-48dd-afb5-151366226f47';

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

export const ENTRY_POINT_V07 =
  '0x0000000071727De22E5E9d8BAf0edAc6f37da032';

export type DeployAndExecutePayload = {
  sender: string;
  initCode: string;
  callData: string;
};

export type DeployAndExecuteResponse = {
  nonce: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  paymaster: string;
  paymasterData: string;
  paymasterVerificationGasLimit: string;
  paymasterPostOpGasLimit: string;
};

export type SubmitUserOpPayload = {
  sender: string;
  nonce: string;
  factory: string;
  factoryData: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymaster: string | null;
  paymasterVerificationGasLimit: string;
  paymasterPostOpGasLimit: string;
  paymasterData: string | null;
  signature: string;
  entryPoint?: string;
};

export type SubmitUserOpResponse = {
  userOpHash: string;
};

export type PollUserOperationResponse = {
  success: boolean;
  receipt?: {
    transactionHash: string;
    blockNumber: string;
  };
  error?: string;
};

export const deployAndExecute = async (
  payload: DeployAndExecutePayload,
): Promise<DeployAndExecuteResponse> => {
  const response = await globalThis.fetch(
    `${API_URL}/pimlico/deploy-and-execute`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pimlico-key': PIMLICO_API_KEY,
      },
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<DeployAndExecuteResponse>(response);
};

export const submitUserOp = async (
  payload: SubmitUserOpPayload,
): Promise<SubmitUserOpResponse> => {
  const response = await globalThis.fetch(
    `${API_URL}/pimlico/submit-user-op`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pimlico-key': PIMLICO_API_KEY,
      },
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<SubmitUserOpResponse>(response);
};

export const pollUserOperation = async (
  userOpHash: string,
): Promise<PollUserOperationResponse> => {
  const response = await globalThis.fetch(
    `${API_URL}/pimlico/user-operation/poll`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pimlico-key': PIMLICO_API_KEY,
      },
      body: JSON.stringify({ userOpHash }),
    },
  );

  return handleResponse<PollUserOperationResponse>(response);
};