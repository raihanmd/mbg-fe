import { InstallationResponse } from 'src/types/installationResponse';
import {
  PrepareInstallation,
  PrepareInstallationResponse,
} from 'src/types/PrepareInstallation';


const API_URL = process.env.API_URL;

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

  return await response.json();
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

  return await response.json();
};

export const getAllInstalledSkills = async (userAddress: string): Promise<InstallationResponse> => {
  const response = await globalThis.fetch(`${API_URL}/installations?userAddress=${userAddress}`)

  const data = (await response.json()) as InstallationResponse;
  return data;
}