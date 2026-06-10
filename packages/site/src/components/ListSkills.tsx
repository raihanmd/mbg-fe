

const skills = [
  {
    name: "AI-Powered DCA",
    badge: "AI market analysis",
    description:
      "Dollar-cost average USDC into WETH, enhanced with Venice AI market analysis before each swap.",
    details: [
      "Fetches crypto news via x402 OttoAI",
      "Analyzes sentiment with Venice AI",
      "Stores AI market context with each execution",
    ],
  },
  {
    name: "Custom Cron DCA",
    badge: "Custom schedule",
    description:
      "Dollar-cost average USDC into WETH on your custom cron schedule using any valid cron expression.",
    details: [
      "Configure cronSchedule directly",
      "Example: 0 9 * * 1-5 for weekdays at 9 AM",
      "Built for personalized recurring DCA plans",
    ],
  },
  {
    name: "USDC Inbound DCA",
    badge: "Event trigger",
    description:
      "Automatically swaps USDC when funds arrive in the smart account, with controls for fixed or percentage-based spending.",
    details: [
      "Triggered by inbound USDC transfers",
      "Fixed amount or percent of inbound",
      "Daily USDC spend limit",
    ],
  },
];



const ListSkills = () => {
  return (
    <section id="skills" className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
            AI Skills
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Pick a DCA worker for your plan.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Each skill defines how the AI agent can spend USDC, when it can
            execute, and which functions are allowed in the delegated scope.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {skills.map((skill) => (
            <article
              key={skill.name}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 transition hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/[0.08]"
            >
              <span className="rounded-full bg-violet-400/15 px-3 py-1 text-sm font-bold text-violet-100">
                {skill.badge}
              </span>
              <h3 className="mt-6 text-2xl font-black">{skill.name}</h3>
              <p className="mt-4 leading-7 text-slate-300">
                {skill.description}
              </p>
              <div className="mt-6 space-y-3">
                {skill.details.map((detail) => (
                  <div
                    key={detail}
                    className="flex gap-3 text-sm text-slate-200"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListSkills;
