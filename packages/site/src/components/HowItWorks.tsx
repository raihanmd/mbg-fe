const steps = [
  { number: "01", title: "Install a skill", description: "Users select wallet skills from the catalog, such as DCA, cron-based execution, or inbound-event strategies." },
  { number: "02", title: "Grant bounded permission", description: "The user signs a constrained delegation. The backend can only operate inside the approved permission scope." },
  { number: "03", title: "Runtime evaluates triggers", description: "Skill Runtime checks schedules, onchain events, skill configuration, and optional data sources." },
  { number: "04", title: "Backend executes approved actions", description: "AI may return execute or skip when enabled, but it never signs. Execution is backend-built and permission-bounded." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section">
    <div className="container">
      <div className="section-heading">
        <p className="eyebrow">Runtime flow</p>
        <h2>How SkillWallet* works</h2>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <article className="step" key={step.number}>
            <span className="step-number">{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
