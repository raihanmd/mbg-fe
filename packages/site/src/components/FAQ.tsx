
  const faqs = [
    {
      question: "What is SkillWallet*?",
      answer:
        "SkillWallet* is a MetaMask Snap marketplace for autonomous AI-powered wallet skills.",
    },
    {
      question: "Do I need the MetaMask Chrome extension?",
      answer:
        "Yes. Install the MetaMask Chrome extension first, then connect your wallet and install the SkillWallet* Snap from this site.",
    },
    {
      question: "What assets are supported?",
      answer:
        "The current DCA setup uses USDC as the input token and supports WETH and cbBTC as output tokens on Base Sepolia.",
    },
    {
      question: "Can I limit how much the AI spends?",
      answer:
        "Yes. Skills can be configured with fixed USDC amounts, daily spend limits, and percent-of-inbound rules for inbound USDC automation.",
    },
    {
      question: "Does the AI get full wallet control?",
      answer:
        "No. SkillWallet* is designed around scoped delegation. Skills define allowed targets, function selectors, and spending limits before execution.",
    },
  ];



const FAQ = () => {
  return (
    <section id="faq" className="bg-slate-950 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Questions before you install?
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Quick answers about installing SkillWallet*, using AI skills, and keeping
            automated DCA execution limited.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 open:border-cyan-200/30 open:bg-cyan-300/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-white">
                {faq.question}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-cyan-200 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
