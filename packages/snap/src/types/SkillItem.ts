// ── New types ──────────────────────────────────────────────

export type X402ServiceConfig = {
  key: string;
  endpoint: string;
  method: 'GET' | 'POST';
  output?: string;
  required: boolean;
};

export type AISkillConfig = {
  provider: 'venice';
  promptTemplate: string;
  inputSources: {
    includeParams: boolean;
    fromX402: string[];
    includeHistory: boolean;
  };
  model?: string;
  maxTokens?: number;
};

export type DelegationScopeMetaItem = {
  targetIndex: number;
  target: string;
  label: string;
  description?: string;
  contractUrl?: string;
  selectors: Array<{
    signature: string;
    label: string;
    description: string;
  }>;
};

// ── Parameter types ────────────────────────────────────────

export type SelectOption = {
  label: string;
  value: string;
  metadata?: SkillMetadata;
};

export type SkillMetadata = {
  address?: string;
  symbol?: string;
  decimals?: number;
};

export type ParameterDefinition =
  | {
      key: string;
      label: string;
      type: 'select';
      required: boolean;
      defaultValue: string;
      options: SelectOption[];
    }
  | {
      key: string;
      label: string;
      type: 'number';
      min?: number;
      max?: number;
      integer?: boolean;
      required: boolean;
      defaultValue: string;
    }
  | {
      key: string;
      label: string;
      type: 'boolean';
      required: boolean;
      defaultValue: string;
    }
  | {
      key: string;
      label: string;
      type: 'string';
      pattern?: string;
      minLength?: number;
      maxLength?: number;
      required: boolean;
      defaultValue: string;
    }
  | {
      key: string;
      label: string;
      type: 'address';
      required: boolean;
      defaultValue: string;
    }
  | {
      key: string;
      label: string;
      type: 'cron';
      required: boolean;
      defaultValue: string;
    };

// ── Delegation scope ───────────────────────────────────────

export type DelegationScope = {
  type: string;
  targets: string[];
  selectors: string[];
  valueLte: { maxValue: string };
  erc20Spendlimit?: Erc20Spendlimit;
};

// ── Skill item ─────────────────────────────────────────────

export type SkillItem = {
  _id: string;
  __v: number;
  name: string;
  description: string;
  iconUrl: string;
  runType: string;
  cronExpression?: string;
  skillId: string;
  chainId: number;
  delegationScope: DelegationScope;
  delegationScopeMeta: DelegationScopeMetaItem[];
  parameters: ParameterDefinition[];
  x402Services?: X402ServiceConfig[];
  aiConfig?: AISkillConfig;
  eventTriggerConfig?: EventTriggerConfig;
  execution?: ExecutionType;
  isActive: boolean;
  trigger?: EventTriggerConfig;
  metadata?: {
    category: string;
    kind: string;
    risk: string;
    builtin: boolean;
  };
  limits?: LimitsType;
  createdAt: string;
  updatedAt: string;
};

// ── Supporting types ───────────────────────────────────────

export type LimitsType = {
  dailySpend: {
    tokenAddress: string;
    period: string;
    maxAmountParam: string;
  };
};

export type ExecutionType = {
  kind: string;
  tokenIn: string;
  router: string;
  defaultFeeTier: string;
};

export type Erc20Spendlimit = {
  token: string;
  period: string;
  maxAmountParam: string;
};

export type EventTriggerConfig = {
  type: string;
  chainId: number;
  contractAddress: string;
  eventSignature: string;
  filterArgs: {
    to: {
      source: string;
      path: string;
    };
  };
  confirmations: number;
  dedupeKey: string;
};

// ── Deprecated aliases (backward compat) ───────────────────

/** @deprecated Use SelectOption instead */
export type SkillOptions = SelectOption;
