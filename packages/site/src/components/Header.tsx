import { useMetaMask, useRequestSnap } from '../hooks';
import LOGO from '../assets/logo-only.webp';

export const Header = () => {
  const { installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();

  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="SkillWallet homepage">
          <img src={LOGO} alt="SkillWallet logo" width={32} height={32} />
          <span>SkillWallet*</span>
        </a>

        <nav className="nav" aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#skills">Skills</a>
          <a href="#architecture">Architecture</a>
        </nav>

        <div className="header-actions">
          <button
            className="button button-secondary"
            onClick={() => requestSnap()}
            disabled={!!installedSnap}
          >
            {installedSnap ? 'Installed' : 'Install SkillWallet*'}
          </button>
        </div>
      </div>
    </header>
  );
};
