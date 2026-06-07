export interface PrepareInstallation {
  skillId: string;
  userAddress: string;
  smartAccountAddress: string;
  parameters?: Record<string, any>;
}



export interface PrepareInstallationResponse {
  delegation: Record<string, any>;
  salt: string;
  skillId: string;
  executorAddress: string;
  chainId: number;
}
