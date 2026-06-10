const ConfigureOptions = () => {
  return (
    <section
      id="configuration"
      className="bg-slate-950 px-6 py-20 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
            Configuration
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight">
            Control the agent budget.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Configure USDC amounts in base units, choose the output token, and
            cap daily execution so automated skills stay bounded by your plan.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            ["outputToken", "Choose WETH or cbBTC as the asset to accumulate."],
            ["amountUsdc", "Set the fixed USDC amount for scheduled DCA runs."],
            [
              "dailySpendLimit",
              "Limit the maximum USDC the agent can spend per day.",
            ],
            [
              "cronSchedule",
              "Customize the cron schedule for scheduled DCA runs.",
            ],
            [
              "percentOfInboundBps",
              "Spend a percentage of inbound USDC, such as 5000 bps for 50%.",
            ],
          ].map(([name, description]) => (
            <div
              key={name}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="font-mono text-cyan-100">{name}</p>
              <p className="mt-2 text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConfigureOptions;
