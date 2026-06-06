import { Link } from 'gatsby';
import { MetaMask } from './MetaMask';
import { PoweredBy } from './PoweredBy';

export const Footer = () => {
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 0',
    borderTop: '1px solid var(--color-primary)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
  };

  const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  };

 

  return (
    <footer style={footerStyle}>
      {/* Navigation similar to Header */}
      <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6">
        <Link to="#" className="text-[var(--color-text)] hover:text-[var(--color-primary-light)] transition-colors">
          Browser Extension
        </Link>
        <Link to="#" className="text-[var(--color-text)] hover:text-[var(--color-primary-light)] transition-colors">
          MetaMask Snap
        </Link>
      </nav>

      {/* Branding button */}
      <a
        href="https://docs.metamask.io/"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
        className="mb-4"
      >
       
      </a>

      {/* Footer links */}
      <div className="flex gap-6 text-sm">
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-text)] underline hover:opacity-80 transition-opacity"
        >
          Privacy Policy
        </a>
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-text)] underline hover:opacity-80 transition-opacity"
        >
          Terms of Service
        </a>
        <span className="text-gray-400">© 2026 DCA Marketplace</span>
      </div>
    </footer>
  );
};

