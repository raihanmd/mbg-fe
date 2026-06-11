import { Toaster } from "../components";
import { defaultSnapOrigin } from "../config";
import { useMetaMask, useMetaMaskContext, useRequestSnap } from "../hooks";
import { isLocalSnap } from "../utils";
import HowToUse from "../components/HowToUse";
import ConfigureOptions from "../components/ConfigureOptions";
import ListSkills from "../components/ListSkills.tsx";
import ValuePillars from "../components/ValuePillars";
import SecurityBoundary from "../components/SecurityBoundary";
import DashboardPreview from "../components/DashboardPreview";
import ClosingCTA from "../components/ClosingCTA";

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  return (
    <main className="w-full overflow-hidden bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-center px-6 py-20 sm:px-10 lg:px-16 lg:py-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute right-[-5%] top-[15%] h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              MetaMask + 1Shot + Venice AI
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Install wallet skills. Execute with limits.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              SkillWallet* turns MetaMask Smart Accounts into a permissioned
              skill runtime. Install skills, grant scoped permissions, and let
              the backend execute approved actions. Some skills use x402 data
              and Venice AI reasoning — but your private key stays yours.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                disabled={!isMetaMaskReady || Boolean(installedSnap)}
                onClick={requestSnap}
                className="rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:hover:translate-y-0"
              >
                {installedSnap ? "Snap Installed" : "Install SkillWallet* Snap"}
              </button>
              <a
                href="#skills"
                className="rounded-xl border border-slate-700 px-8 py-4 text-center text-base font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white hover:-translate-y-0.5"
              >
                Explore Skills
              </a>
            </div>

            {!isMetaMaskReady && (
              <p className="mt-4 text-sm text-warning">
                MetaMask Snaps are not detected. Install or unlock the MetaMask
                browser extension, then refresh this page.
              </p>
            )}

            <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              AI reasons. Backend executes. User controls permissions.
            </p>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <ValuePillars />
      <ListSkills />
      <HowToUse />
      <SecurityBoundary />
      <ConfigureOptions />
      <ClosingCTA />

      <Toaster error={error} />
    </main>
  );
};

export default Index;