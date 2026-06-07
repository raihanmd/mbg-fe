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
  delegationScope: {
    type: string;
    targets: string[];
    selectors: string[];
    valueLte: { maxValue: string };
    erc20Spendlimit?: Erc20Spendlimit
  };
  parameters: Array<{
    key: string;
    label: string;
    type: string;
    required: boolean;
    options?: SkillOptions[];
    defaultValue: string;
    description: string;
  }>;
  eventTriggerConfig?: EventTriggerConfig
  execution?: ExecutionType
  isActive: boolean;
  trigger?: EventTriggerConfig
  metadata?: {
    category: string;
    kind: string;
    risk: string;
    builtin: boolean;
  };
  limits?: LimitsType
  createdAt: string;
  updatedAt: string;
};


type LimitsType = {
  dailySpend: {
    tokenAddress: string
    period: string;
    maxAmountParam: string;
  }
}

type ExecutionType = {
  kind: string;
  tokenIn: string;
  router: string;
  defaultFeeTier: string;
}

type Erc20Spendlimit = {
  token: string;
  period: string;
  maxAmountParam: string
}

type EventTriggerConfig = {
  type: string;
  chainId: number;
  contractAddress: string;
  eventSignature: string;
  filterArgs: {
    to: {
      source: string;
      path: string;
    }
  }
  confirmations: number;
  dedupeKey: string;
}

export type SkillOptions = {
  label: string;
  value: string;
  metadata?: SkillMetadata

}

export type SkillMetadata = {
  address?: string;
  symbol: string;
  decimals: number;
}