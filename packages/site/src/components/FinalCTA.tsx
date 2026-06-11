import { useMetaMask, useRequestSnap } from '../hooks';

const FinalCTA = () => {
  const { installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();

  return (
    <section className="final-cta">
      <div className="container final-cta-inner">
        <p className="eyebrow">Start controlled</p>
        <h2>Start with one bounded wallet skill.</h2>
        <div className="cta-actions">
          <button
            className="button button-primary"
            onClick={() => requestSnap()}
            disabled={!!installedSnap}
          >
            Install SkillWallet* Snap
          </button>
          <a className="button button-ghost" href="#skills">
            Explore Skills
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
