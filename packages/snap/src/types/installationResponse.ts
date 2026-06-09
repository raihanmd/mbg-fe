export type InstallationStatus = 'active' | 'revoked' | 'pending' | 'failed';

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
  status: 'failed' | 'success' | 'pending' | 'skipped';
  trigger: unknown | null;
  spend: unknown | null;
  aiContext: string;
  newsContext: string;
  oneShotTaskId: string;
  completedAt: string | null;
  errorMessage: string | null;
};

export type InstallationParameters = {
  outputToken: string;
  amountUsdc?: string;
  spendMode?: string;
  amountPerRun?: string;
  percentOfInboundBps?: number;
  dailySpendLimit?: string;
};

export type InstallationItem = {
  _id: string;
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
