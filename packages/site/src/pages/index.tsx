import { Toaster } from "../components";
import { defaultSnapOrigin } from "../config";
import { useMetaMask, useMetaMaskContext, useRequestSnap } from "../hooks";
import { isLocalSnap } from "../utils";
import HowToUse from "../components/HowToUse";
import ConfigureOptions from "../components/ConfigureOptions";
import Testimonials from "../components/Testimonials";
import ListSkills from "../components/ListSkills.tsx";
const stats = [
  ["84532", "Base Sepolia chain"],
  ["9 AM", "Daily cron execution"],
  ["USDC", "Primary funding token"],
  ["WETH / cbBTC", "Supported target assets"],
];
const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  return (
    <main className="w-full overflow-hidden bg-[#070A12] text-white">
      <section className="relative px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              MBG: MetaMask Based Gigs
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Install AI agent skills that execute your DCA plan.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              MBG is a MetaMask Snap for delegating automated DeFi work to AI
              skills. Configure USDC budgets, daily limits, target assets, and
              inbound-transfer rules while keeping execution scoped by Snap
              permissions.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                disabled={!isMetaMaskReady || Boolean(installedSnap)}
                onClick={requestSnap}
                className="rounded-2xl bg-cyan-300 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_0_40px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300 disabled:shadow-none"
              >
                {installedSnap ? "Snap Installed" : "Install MBG Snap"}
              </button>
              <a
                href="#skills"
                className="rounded-2xl border border-white/15 px-6 py-4 text-center text-base font-bold text-white transition hover:border-cyan-200/60 hover:bg-white/10"
              >
                Explore Skills
              </a>
            </div>

            {!isMetaMaskReady && (
              <p className="mt-4 text-sm text-amber-200">
                MetaMask Snaps are not detected. Install or unlock the MetaMask
                browser extension, then refresh this page.
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-950/80 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active plan</p>
                  <h2 className="text-2xl font-bold">USDC Auto DCA</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                {[
                  ["Daily execution", "0 9 * * *"],
                  ["Spend limit", "10 USDC / day"],
                  ["Inbound mode", "50% of received USDC"],
                  ["Delegation scope", "approve, transfer, swap"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-1 font-mono text-lg text-cyan-100">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
            >
              <p className="text-2xl font-black text-cyan-200">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <ListSkills />
      <HowToUse />
      <ConfigureOptions />
      <Testimonials />
      <section id="security" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-cyan-200/20 bg-cyan-300/10 p-8 sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Built for scoped automation, not blind custody.
          </h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            MBG skills use function-call delegation scopes for USDC transfer,
            approval, and SwapRouter execution. Event-triggered skills can also
            enforce ERC-20 spend limits by day before executing inbound DCA.
          </p>
        </div>
      </section>

      <Toaster error={error} />
    </main>
  );
};

export default Index;
