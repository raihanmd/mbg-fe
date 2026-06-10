export type InstallationStatus =
  | 'active'
  | 'paused'
  | 'revoked'
  | 'pending'
  | 'failed';

export type ExecutionStatus =
  | 'pending'
  | 'submitted'
  | 'confirmed'
  | 'success'
  | 'failed'
  | 'skipped';

export type SkillId = {
  _id: string;
  name: string;
  chainId: number;
  iconUrl: string;
  runType: string;
  skillId: string;
};

export type SignedDelegationCaveat = {
  enforcer: string;
  terms: string;
  args: string;
};

export type SignedDelegation = {
  delegate: string;
  delegator: string;
  authority: string;
  caveats: SignedDelegationCaveat[];
  salt: string;
  signature: string;
};

export type InstallationExecution = {
  executionId: string;
  executedAt: string;
  status: ExecutionStatus;
  trigger: unknown | null;
  spend: unknown | null;
  aiContext?: string;
  newsContext?: string;
  skippedReason?: string;
  oneShotTaskId?: string;
  txHash?: string;
  completedAt: string | null;
  errorMessage: string | null;
};

export type InstallationParameters = Record<string, unknown>;

export type InstallationItem = {
  _id: string;
  installationId?: string;
  userAddress: string;
  smartAccountAddress: string;
  skillId: SkillId;
  signedDelegation: SignedDelegation;
  delegationSalt: string;
  chainId: number;
  parameters: InstallationParameters;
  status: InstallationStatus;
  executions: InstallationExecution[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastExecutedAt?: string | null;
  nextExecutionAt?: string | null;
};

export type InstallationResponse = {
  data: InstallationItem[];
};
