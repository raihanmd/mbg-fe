export interface PrepareInstallation {
  /**
   * Mongo ObjectId of the skill being installed
   * @example '652f1f77bcf86cd799439011'
   */
  skillId: string;

  /**
   * EOA address of the user installing the skill (MetaMask Account)
   * @example '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
   */
  userAddress: string;

  /**
   * MetaMask Hybrid Smart Account address. This is the real delegation delegator.
   * @example '0x1234567890123456789012345678901234567890'
   */
  smartAccountAddress: string;

  /**
   * Skill parameters/config used by frontend proof flow (e.g., nominal DCA)
   */
  config?: Record<string, any>;

  /**
   * Skill parameters used to scope the delegation
   */
  parameters?: Record<string, any>;
}



export interface PrepareInstallationResponse {
  delegation: Record<string, any>;
  salt: string;
  skillId: string;
  executorAddress: string;
  chainId: number;
}
