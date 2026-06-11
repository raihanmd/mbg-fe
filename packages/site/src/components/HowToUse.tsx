import React from "react";

import { defaultSnapOrigin } from "../config";
import { useMetaMask, useRequestSnap } from "../hooks";
import { isLocalSnap } from "../utils";

const steps = [
  {
    number: "01",
    title: "Install skill",
    description:
      "Select a skill from the marketplace and add it to your Snap.",
  },
  {
    number: "02",
    title: "Grant permission",
    description:
      "Define the spending scope: contracts, functions, and daily limits.",
  },
  {
    number: "03",
    title: "Trigger fires",
    description:
      "Cron schedule, onchain event, or manual execution starts the workflow.",
  },
  {
    number: "04",
    title: "Optional reasoning",
    description:
      "If enabled, Venice AI reads x402 data and returns execute or skip.",
  },
  {
    number: "05",
    title: "Execute",
    description:
      "1Shot submits the approved transaction through delegated permissions.",
  },
  {
    number: "06",
    title: "Review",
    description:
      "Every execution is recorded. Review what ran and why in your Snap dashboard.",
  },
];

const HowToUse = () => {
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  return (
    <section id="how-to-use" className="py-28 bg-muted/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            How It Works
          </p>
          <h2 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            How SkillWallet* runs a skill.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            From install to review — every step keeps the user in control.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="group relative rounded-xl bg-card border border-border/40 p-6"
            >
              <span className="text-5xl font-black text-primary/10 absolute top-4 right-6">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>

              {index === 0 && (
                <button
                  type="button"
                  disabled={!isMetaMaskReady || Boolean(installedSnap)}
                  onClick={requestSnap}
                  className="mt-6 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:hover:translate-y-0"
                >
                  {installedSnap ? "Snap Installed" : "Install Snap"}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;