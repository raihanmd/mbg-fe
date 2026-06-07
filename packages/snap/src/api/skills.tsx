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
  const response = await globalThis.fetch(`${API_URL}/skills/${skillId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }

  const data = await response.json();
  console.log(data);
  return data as SkillItem;
};
