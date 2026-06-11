const rows = [
  ["Trigger", "Cron schedule"],
  ["x402", "Market analysis enabled"],
  ["Venice AI", "execute / skip reasoning"],
  ["Scope", "approve, transfer, swap"],
  ["Spend limit", "10 USDC / day"],
];

const DashboardPreview = () => {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card to-background p-1 shadow-2xl shadow-black/40">
      <div className="rounded-xl bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
              SKW
            </div>
            <h2 className="text-base font-semibold text-foreground">
              AI-Powered DCA
            </h2>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent ring-1 ring-accent/20">
            Active
          </span>
        </div>

        <div className="mt-5 space-y-2.5">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {label}
              </p>
              <p className="mt-0.5 font-mono text-sm font-medium text-slate-200">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-border/50 pt-5">
          <p className="text-xs text-slate-400">
            Next run:{" "}
            <span className="font-mono font-semibold text-slate-200">
              09:00 UTC
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Execution via 1Shot delegated transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;