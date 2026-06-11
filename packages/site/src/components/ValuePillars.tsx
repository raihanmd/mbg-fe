const pillars = [
  {
    number: "01",
    title: "Permission-scoped",
    description:
      "Each skill defines contracts, functions, limits, and triggers.",
  },
  {
    number: "02",
    title: "Optional AI reasoning",
    description:
      "Venice AI can decide execute or skip when the skill enables it.",
  },
  {
    number: "03",
    title: "x402 data ready",
    description: "Skills can fetch paid external data before reasoning.",
  },
  {
    number: "04",
    title: "Delegated execution",
    description:
      "1Shot submits the approved transaction through delegated permissions.",
  },
];

const ValuePillars = () => {
  return (
    <section id="pillars" className="py-28 bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Design Principles
          </p>
          <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Skills that respect boundaries.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Every skill defines exactly what it can do before it ever runs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-xl bg-muted/30 p-6"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary font-mono">
                {pillar.number}
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePillars;