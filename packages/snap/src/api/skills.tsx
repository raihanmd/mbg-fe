import { SkillItem } from '../types/SkillItem';

type SkillsResponse = {
  data: SkillItem[];
};

const API_URL = process.env.API_URL;

export const getAllSkills = async (): Promise<SkillItem[]> => {
  const response = await globalThis.fetch(`${API_URL}/skills`);

  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }

  const data = (await response.json()) as SkillsResponse;
  return data.data ?? [];
};

export const getSkillById = async (skillId: string): Promise<SkillItem> => {
  try {
    const response = await globalThis.fetch(`${API_URL}/skills/${skillId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch skill ${skillId}: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched skill:', data);
    return data as SkillItem;
  } catch (err:any) {
    console.error('Error in getSkillById:', err);
    throw new Error(err?.message ?? 'Unable to retrieve skill data');
  }
};
