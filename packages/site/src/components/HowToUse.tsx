import React from 'react';

const steps = [
  {
    number: '1',
		title: 'Connect Wallet',
	description: 'Connect Skill Wallet through metamask snap'
  },
  {
    number: '2',
    title: 'Choose a Skill',
    description: 'Select an automated strategy such as DCA BTC, DCA ETH, or another supported asset.'
  },
  {
    number: '3',
    title: 'Pick the Cadence',
    description: 'Set your preferred investment frequency, such as 1 week or 1 month.'
  },
  {
    number: '4',
    title: 'Confirm Strategy',
    description: 'Review the parameters and confirm the strategy deployment.'
  },
  {
    number: '5',
    title: 'AI Reasoning',
    description: 'The AI layer analyzes market conditions to determine the optimal execution timing.'
  },
  {
    number: '6',
    title: 'Smart Execution',
    description: 'The smart account seamlessly executes the trade according to your approved permissions.'
  }
];

const HowToUse = () => {
  return (
    <section className="w-full py-24 px-6 bg-[#0a192f] border-t border-b border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary-light)] font-semibold text-sm tracking-wider uppercase mb-2">
            Workflow
          </div>
          <h2 className=" font-bold text-white">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Set up your automated Dollar Cost Averaging in six simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,200,83,0.3)] overflow-hidden"
            >
              {/* Large background number */}
              <div className="absolute -top-6 -right-4 text-9xl font-black text-white/5 group-hover:text-[var(--color-primary)]/10 transition-colors duration-300 pointer-events-none">
                {step.number}
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] font-bold text-xl mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-black transition-colors duration-300">
                  {step.number}
                </div>
					  <h6 className="text-sm font-bold text-white mb-3" style={{fontSize: "40px"}}>{step.title}</h6>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;