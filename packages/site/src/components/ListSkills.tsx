import React, { useEffect, useState } from 'react'
import SkillsCard from './SkillsCard';
import { SkillItem, getAllSkills } from '../api/skills';

const ListSkills = () => {

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
   useEffect(() => {
     const loadSkills = async () => {
       setSkillsLoading(true);

       try {
         const data = await getAllSkills();
         setSkills(data);
       } catch {
         setSkills([]);
       } finally {
         setSkillsLoading(false);
       }
     };

     loadSkills().catch(() => setSkills([]));
   }, []);

  return (
    <section
      id="get-skills"
      className="w-full bg-[var(--color-bg)] py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary-light)] font-semibold text-sm tracking-wider uppercase">
          Library
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Get Skills
        </h2>
        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Explore our curated DCA skills library. Discover AI‑powered automation
          tailored for different assets and risk profiles, and instantly
          integrate them into your wallet.
        </p>
      </div>
      <div className="w-full max-w-7xl px-6 flex flex-col items-center mt-8">
       
        <div className='grid grid-cols-2'>
          {skills.map((skill: SkillItem) => (
            <SkillsCard
              key={skill._id}
              skill={skill}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ListSkills