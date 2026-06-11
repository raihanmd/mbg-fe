const skills = [
  {
    name: "AI-Powered DCA",
    badge: "x402 + Venice AI",
    description:
      "Fetches paid market context, asks Venice AI for execute/skip reasoning, then runs DCA only when allowed.",
    chips: ["Cron", "x402", "Venice AI", "1Shot"],
    featured: true,
  },
  {
    name: "Custom Cron DCA",
    badge: "Deterministic",
    description:
      "Runs fixed DCA on a user-defined schedule without AI reasoning.",
    chips: ["Cron", "No AI", "swap"],
    featured: false,
  },
  {
    name: "USDC Inbound DCA",
    badge: "Event Trigger",
    description:
      "Detects inbound USDC and converts a fixed or percentage amount within the user&apos;s spend limit.",
    chips: ["Onchain event", "No AI", "transfer/swap"],
    featured: false,
  },
];

const ListSkills = () => {
  return (
    <section id="skills" className="py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Skills
          </p>
          <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Skills for autonomous wallet workflows.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Some skills are deterministic. Some add AI reasoning when it is
            useful.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {skills.map((skill) => (
            <article
              key={skill.name}
              className={
                skill.featured
                  ? "flex flex-col rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-card p-6 sm:p-8 transition hover:border-primary/40"
                  : "flex flex-col rounded-2xl border border-border/50 bg-card p-6 sm:p-8 transition hover:border-primary/40"
              }
            >
              <span className="inline-flex self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                {skill.badge}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground sm:text-xl">
                {skill.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {skill.description}
              </p>

              <div className="mt-auto pt-5">
                <div className="flex flex-wrap gap-2">
                  {skill.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-md bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-slate-400 font-mono"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListSkills;