const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "MBG turns DCA from a manual reminder into a controlled automation. The daily spend limit makes the agent feel practical instead of risky.",
      name: "Raka Pratama",
      role: "DeFi builder",
    },
    {
      quote:
        "The inbound USDC trigger is exactly what I wanted. When funds arrive, a percentage can be moved into my accumulation strategy automatically.",
      name: "Nadia Chen",
      role: "Onchain operator",
    },
    {
      quote:
        "I like that skills are explicit. I can see what the AI agent is allowed to call before enabling the strategy.",
      name: "Arman Yusuf",
      role: "Smart account user",
    },
  ];

  return (
    <section id="testimonials" className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
              Testimonials
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Built for users who want automation with boundaries.
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-300">
            Early user feedback
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-black/10"
            >
              <div className="mb-6 flex gap-1 text-cyan-200" aria-hidden="true">
                <span>*</span>
                <span>*</span>
                <span>*</span>
                <span>*</span>
                <span>*</span>
              </div>
              <blockquote className="text-lg leading-8 text-slate-200">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="font-black text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {testimonial.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
