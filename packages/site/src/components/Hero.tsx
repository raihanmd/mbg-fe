import RuntimePanel from './RuntimePanel';
import { useMetaMask, useRequestSnap } from '../hooks';

const Hero = () => {
  const { installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Wallet skill runtime</p>
          <h1>Install wallet skills without giving AI your private key.</h1>
          <p className="hero-description">
            SkillWallet* lets users grant bounded permissions to wallet skills.
            AI can reason when enabled, but execution stays permissioned,
            delegated, and controlled by the user.
          </p>
          <p className="core-message">
            AI reasons. Backend executes. User controls permissions.
          </p>
          <div className="hero-actions">
            <button
              className="button button-primary"
              onClick={() => requestSnap()}
              disabled={!!installedSnap}
            >
              {!!installedSnap
                ? 'SkillWallet* Installed'
                : 'Install SkillWallet* Snap'}
            </button>
            <a className="button button-ghost" href="#skills">
              Explore Skills
            </a>
          </div>
        </div>
        <RuntimePanel />
      </div>
    </section>
  );
};

export default Hero;
