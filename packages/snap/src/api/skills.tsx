export type SkillItem = {
  _id: string;
  skillId: string;
  adapter: string;
  aiMode: string;
  builtIn: boolean;
  defaultChainId: number;
  defaultSchedule: {
    type: string;
    frequency?: string;
    timezone?: string;
  };
  description: string;
  metadata?: {
    icon?: string;
    tags?: string[];
    riskLevel?: string;
  };
  name: string;
  permissionRequirements: unknown[];
  permissionTemplate: {
    type: string;
    defaultSelectors: string[];
    defaultTokens: string[];
  };
  pricing?: {
    type: string;
    options?: Array<{
      id: string;
      label: string;
      durationDays: number;
      skillFeeUsdc: string;
      recommended?: boolean;
    }>;
  };
  slug: string;
  status: string;
  supportedChains: number[];
};

type SkillsResponse = {
  payload: SkillItem[];
};

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export const getAllSkills = async (): Promise<SkillItem[]> => {
  const response = await fetch(`${API_URL}/skills`);

  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }

  const data = (await response.json()) as SkillsResponse;
  return data.payload ?? [];
};

export const getSkillById = async (skillId: string): Promise<any> => {
  const response = await fetch(`${API_URL}/skills/${skillId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }

  const data = await response.json();
  console.log(data);
  return data;
};
