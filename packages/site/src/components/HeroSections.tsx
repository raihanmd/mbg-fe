import React from 'react';
import { useMetaMask, useRequestSnap } from '../hooks';

const HeroSections = () => {
  const requestSnap = useRequestSnap();
  const { installedSnap } = useMetaMask();

  async function installSnap() {
    await requestSnap();
  }
  
  return (
    <div className="w-full flex flex-col items-center">
      {/* Section 1: Hero */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-bg)] via-[#0a192f] to-[var(--color-primary-dark)] px-6 overflow-hidden">
        {/* Glassmorphism / glowing background effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-(--color-primary) rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-(--color-primary-light) rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>

        <div className="relative z-10 text-center  mx-auto space-y-8">
          <h1
            className="text-6xl  font-extrabold tracking-tight text-transparent bg-clip-text  text-white"
            style={{ fontSize: '100px' }}
          >
            DCA Marketplace Skills
          </h1>

          <p className="text-xl md:text-4xl text-gray-300 max-w-5xl mx-auto font-light leading-relaxed">
            Choose a skills to used for DCA and let AI‑assisted automation
            execute your Dollar Cost Averaging strategy effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
            <button
              onClick={installSnap}
              disabled={!!installedSnap}
              className="px-12 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-black font-bold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,200,83,0.3)] hover:shadow-[0_0_40px_rgba(0,200,83,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {installedSnap ? 'DCA Snap Wallet Installed' : 'Get DCA Snap Wallet'}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70">
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default HeroSections;