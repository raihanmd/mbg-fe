import React from 'react';
import { navigate } from 'gatsby';
import { Card } from './Card';
import type { SkillItem } from '../api/skills';

const SkillsCard = ({ skill }: { skill: SkillItem }) => {
  return (
    <Card
      key={skill._id}
      fullWidth={true}
      content={{
        title: skill.name,
        description: (
          <div>
            <div>{skill.slug}</div>
            <p>{skill.description}</p>
          </div>
        ),
        button: (
          <button
            className="w-full bg-indigo-400 px-6 py-2 rounded-md mt-2 text-white font-bold hover:bg-indigo-500 transition-colors"
            type="button"
            onClick={() => navigate(`/skills/${skill.skillId}`)}
          >
            Choose Skill
          </button>
        ),
      }}
    />
  );
};

export default SkillsCard