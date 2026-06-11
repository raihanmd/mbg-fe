const canItems = [
  "Read skill context",
  "Read x402 market data",
  "Return execute / skip",
  "Explain reason",
];

const cannotItems = [
  "Access private key",
  "Sign transactions",
  "Call arbitrary contracts",
  "Bypass permission scope",
  "Execute revoked skills",
];

const SecurityBoundary = () => {
  return (
    <section id="security" className="py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Security Model
          </p>
          <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Not an AI wallet takeover.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            AI never receives your private key, never signs transactions, and
            never directly submits wallet actions. SkillWallet* separates
            reasoning from execution.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/15">
                <svg
                  className="h-5 w-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-accent">AI can</h3>
            </div>
            <ul className="space-y-3.5">
              {canItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <span className="mt-px h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-red-500/15 bg-gradient-to-b from-red-500/5 to-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/15">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400">AI cannot</h3>
            </div>
            <ul className="space-y-3.5">
              {cannotItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <span className="mt-px h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-accent/5 border border-accent/15 p-5 text-center">
          <p className="text-sm font-medium text-slate-300">
            Execution remains bounded by the user&apos;s delegated permission.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecurityBoundary;