import {
  InstallationResponse,
  InstallationItem,
  InstallationExecution,
} from '../types/installationResponse';
import {
  PrepareInstallation,
  PrepareInstallationResponse,
} from '../types/PrepareInstallation';

const API_URL = 'http://localhost:4000';

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

export const prepareInstallation = async (
  body: PrepareInstallation,
): Promise<PrepareInstallationResponse> => {
  const response = await globalThis.fetch(`${API_URL}/installations/prepare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<PrepareInstallationResponse>(response);
};

export const confirmInstallation = async (
  body: PrepareInstallation,
): Promise<PrepareInstallationResponse> => {
  const response = await globalThis.fetch(`${API_URL}/installations/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<PrepareInstallationResponse>(response);
};

export const getAllInstalledSkills = async (
  userAddress: string,
): Promise<InstallationResponse> => {
  const response = await globalThis.fetch(
    `${API_URL}/installations?userAddress=${userAddress}`,
  );
  const data = (await response.json()) as InstallationResponse;
  return data;
};

export const getInstallationById = async (
  installationId: string,
): Promise<InstallationItem> => {
  const response = await globalThis.fetch(
    `${API_URL}/installations/${installationId}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch installation: ${response.status}`);
  }
  const data = await response.json();
  return (data.data ?? data) as InstallationItem;
};

export const getInstallationExecutions = async (
  installationId: string,
): Promise<{ data: InstallationExecution[] }> => {
  const response = await globalThis.fetch(
    `${API_URL}/installations/${installationId}/executions`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch executions: ${response.status}`);
  }
  const data = await response.json();
  return data as { data: InstallationExecution[] };
};

export const revokeInstallation = async (
  id: string,
  userAddress: string,
): Promise<void> => {
  const response = await globalThis.fetch(`${API_URL}/installations/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAddress }),
  });
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
};

export const pauseInstallation = async (
  id: string,
  userAddress: string,
): Promise<void> => {
  const response = await globalThis.fetch(
    `${API_URL}/installations/${id}/pause`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAddress }),
    },
  );
  await handleResponse(response);
};

export const resumeInstallation = async (
  id: string,
  userAddress: string,
): Promise<void> => {
  const response = await globalThis.fetch(
    `${API_URL}/installations/${id}/resume`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAddress }),
    },
  );
  await handleResponse(response);
};