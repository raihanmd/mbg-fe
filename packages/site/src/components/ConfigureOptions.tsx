const params = [
  {
    name: "outputToken",
    description: "Choose WETH or cbBTC as the asset to accumulate.",
  },
  {
    name: "amountUsdc",
    description: "Set the fixed USDC amount for scheduled DCA runs.",
  },
  {
    name: "dailySpendLimit",
    description: "Limit the maximum USDC the skill can spend per day.",
  },
  {
    name: "cronSchedule",
    description: "Customize the cron schedule for scheduled DCA runs.",
  },
  {
    name: "percentOfInboundBps",
    description:
      "Spend a percentage of inbound USDC, such as 5000 bps for 50%.",
  },
];

const ConfigureOptions = () => {
  return (
    <section id="configuration" className="py-28 bg-muted/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Configuration
          </p>
          <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Skills are configured before they run.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Each parameter defines the budget, target, schedule, and execution
            scope before any action can be taken.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {params.map((param) => (
            <div
              key={param.name}
              className="rounded-lg bg-muted/30 border border-border/30 border-l-2 border-l-primary/30 p-5 transition-colors hover:bg-muted/40"
            >
              <p className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                {param.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {param.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConfigureOptions;