import React from 'react'
import { Card } from './Card';
import type { SkillItem } from '../hooks/useRecommendation';
import { Snap } from 'src/types';

const SkillsCard = ({ skill, installedSnap }: {skill: SkillItem, installedSnap:Snap | null}) => {
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
            type="button"
				onClick={() => { }
            }
            disabled={!installedSnap}
          >
            Install Skill
          </button>
        ),
      }}
      disabled={!installedSnap}
    />
  );
}

export default SkillsCard