export type SkillItem = {
  _id: string;
  name: string;
  description: string;
  iconUrl: string;
  runType: string;
  cronExpression: string;
  chainId: number;
  delegationScope: {
    type: string;
    targets: string[];
    selectors: string[];
    valueLte: { maxValue: string };
  };
  parameters: Array<{
    key: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    defaultValue?: string;
    description?: string;
  }>;
  isActive: boolean;
  metadata: {
    category: string;
    kind: string;
    risk: string;
    builtin: boolean;
  };
  createdAt: string;
  updatedAt: string;
};
