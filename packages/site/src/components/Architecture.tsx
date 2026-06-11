const nodes = [
  "User + MetaMask", "Frontend App", "Skill Catalog", "Installation / Delegation API",
  "Database", "Skill Runtime", "Cron Runner / Event Handler", "Optional x402 Service",
  "Optional Venice AI reasoning", "Execution Builder", "Sponsor / Executor Context", "1Shot Relayer",
  "EVM Chain", "Execution History",
];

const Architecture = () => (
  <section id="architecture" className="section">
    <div className="container">
      <div className="section-heading">
        <p className="eyebrow">System design</p>
        <h2>Runtime architecture</h2>
        <p className="section-lead">
          The runtime keeps reasoning, permission checks, execution building,
          and wallet signing clearly separated.
        </p>
      </div>
      <div className="architecture" aria-label="SkillWallet runtime architecture">
        {nodes.map((node) => (
          <div className="architecture-node" key={node}>{node}</div>
        ))}
      </div>
    </div>
  </section>
);

export default Architecture;
