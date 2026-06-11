const ClosingCTA = () => {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-primary/10 px-8 py-20 sm:px-16 sm:py-24 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-balance sm:text-2xl lg:text-3xl">
            Your keys. Your rules. Automated execution.
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-lg leading-relaxed text-slate-300">
            Install bounded wallet skills, add optional AI reasoning, and keep
            execution inside the permission scope you approved.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#skills"
              className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Explore Skills
            </a>
            <a
              href="#security"
              className="rounded-xl border border-slate-700 px-8 py-4 text-center text-base font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white hover:-translate-y-0.5"
            >
              View Delegation Scope
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;