import React from 'react';

import { defaultSnapOrigin } from '../config';
import { useMetaMask, useRequestSnap } from '../hooks';
import { isLocalSnap } from '../utils';

const cards = [
  {
    title: 'Step 1',
    description: 'Install the MBG Snap from your MetaMask browser extension.',
    visual: 'install',
  },
  {
    title: 'Step 2',
    description: 'Choose AI-Powered DCA, Custom Cron DCA, or USDC Inbound DCA.',
    visual: 'config',
  },
  {
    title: 'Step 3',
    description: 'Your plan is active and the agent executes inside your approved scope.',
    visual: 'active',
  },
];

const HowToUse = () => {
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  return (
    <section id="how-to-use" className="relative overflow-hidden bg-black px-6 py-24 text-white sm:px-10 lg:px-16">
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
            ● How to install
          </p>
          <h2 className="mt-4 text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl">
            Installs in
            <span className="block bg-gradient-to-r from-cyan-100 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
              seconds ↓
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
            No more manual reminders. Add the Snap, select a DCA skill, and let your approved AI agent execute USDC plans automatically.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-white/15 bg-white/[0.02] p-8 text-center shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-emerald-300/50"
            >
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-emerald-500/20 via-cyan-400/5 to-transparent opacity-80" />
              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tight">{card.title}</h3>
                <p className="mx-auto mt-4 max-w-[15rem] text-sm leading-6 text-slate-400">
                  {card.description}
                </p>
              </div>

              {card.visual === 'install' && (
                <div className="relative z-10 mt-12 flex justify-center">
                  <div className="relative grid h-28 w-56 place-items-center rounded-[50%] border border-emerald-300/60 bg-emerald-400/10 shadow-[0_0_55px_rgba(34,197,94,0.35)]">
                    <button
                      type="button"
                      disabled={!isMetaMaskReady || Boolean(installedSnap)}
                      onClick={requestSnap}
                      className="rounded-full border border-emerald-200/60 bg-emerald-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(74,222,128,0.5)]"
                    >
                      {installedSnap ? 'Snap Installed' : 'Add to MetaMask'}
                    </button>
                    <span className="absolute -right-2 bottom-8 text-2xl">⌁</span>
                  </div>
                </div>
              )}

              {card.visual === 'config' && (
                <div className="relative z-10 mx-auto mt-10 max-w-[15rem] rounded-xl border border-white/10 bg-white/[0.08] p-4 text-left backdrop-blur">
                  <p className="text-base font-black leading-5 text-white">Configure your DCA skill</p>
                  <div className="mt-4 h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-emerald-400" />
                  </div>
                  {['AI sentiment', 'Cron schedule', 'Daily spend limit', 'Execution scope'].map((item, index) => (
                    <div key={item} className="mt-3 flex items-center justify-between text-xs text-slate-300">
                      <span>{index + 1}. {item}</span>
                      <span className="text-emerald-300">○</span>
                    </div>
                  ))}
                </div>
              )}

              {card.visual === 'active' && (
                <div className="relative z-10 mt-12 flex flex-col items-center">
                  <div className="relative h-32 w-56">
                    <div className="absolute inset-x-4 bottom-0 h-28 rounded-t-full border-[10px] border-b-0 border-emerald-400 shadow-[0_0_45px_rgba(34,197,94,0.45)]" />
                    <div className="absolute right-7 top-12 h-5 w-5 rounded-full border-4 border-black bg-emerald-300" />
                    <div className="absolute inset-x-0 bottom-0 text-center">
                      <p className="text-4xl font-black">87%</p>
                      <p className="mt-1 text-xl font-bold text-emerald-100">Plan Active</p>
                      <p className="mt-1 text-xs text-slate-500">Agent ready to execute</p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
