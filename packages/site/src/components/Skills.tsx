import { useMetaMask, useRequestSnap } from '../hooks';

const skills = [
  {
    name: 'AI-Powered DCA',
    badge: 'schedule',
    details: [
      { label: 'Trigger', value: 'schedule' },
      { label: 'Data', value: 'optional x402' },
      { label: 'Reasoning', value: 'Venice AI enabled' },
      { label: 'Execution', value: 'delegated backend call' },
      { label: 'Permission', value: 'bounded spend + token scope' },
    ],
    skillId: 'ai-powered-dca',
  },
  {
    name: 'Custom Cron DCA',
    badge: 'cron',
    details: [
      { label: 'Trigger', value: 'custom cron' },
      { label: 'Data', value: 'none required' },
      { label: 'Reasoning', value: 'disabled' },
      { label: 'Execution', value: 'delegated backend call' },
      { label: 'Permission', value: 'bounded spend + schedule scope' },
    ],
    skillId: 'custom-cron-dca',
  },
  {
    name: 'USDC Inbound DCA',
    badge: 'event',
    details: [
      { label: 'Trigger', value: 'USDC inbound event' },
      { label: 'Data', value: 'optional runtime context' },
      { label: 'Reasoning', value: 'optional' },
      { label: 'Execution', value: 'delegated backend call' },
      { label: 'Permission', value: 'bounded token + receiver scope' },
    ],
    skillId: 'usdc-inbound-dca',
  },
];

const Skills = () => {
  const { installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Skill modules</p>
          <h2>Installable wallet skills</h2>
          <p className="section-lead">
            Skills are installed as permissioned modules. Each skill declares
            its trigger, execution scope, and whether AI reasoning is enabled.
          </p>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <article className="skill-card" key={skill.name}>
              <div className="skill-card-header">
                <h3>{skill.name}</h3>
                <span>{skill.badge}</span>
              </div>
              <dl className="skill-details">
                {skill.details.map((d) => (
                  <div key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
