import { Link } from "gatsby";

import { SnapLogo } from "./SnapLogo";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <div className="footer-logo-shell">
              <SnapLogo color="rgb(103, 232, 249)" size={24} />
            </div>
            <p className="footer-title">SkillWallet*</p>
          </div>
          <p className="footer-description">
            A permissioned skill runtime for MetaMask Smart Accounts. Install
            skills, set limits, and let the backend execute approved actions —
            with optional Venice AI reasoning and x402 data.
          </p>
        </div>

        <div>
          <p className="footer-column-title">Product</p>
          <div className="footer-link-list">
            <Link className="footer-link" to="/#skills">Skills</Link>
            <Link className="footer-link" to="/#how-to-use">How It Works</Link>
            <Link className="footer-link" to="/#security">Security</Link>
            <Link className="footer-link" to="/#configuration">Configuration</Link>
            <Link className="footer-link" to="/#pillars">Design Principles</Link>
          </div>
        </div>

        <div>
          <p className="footer-column-title">Resources</p>
          <div className="footer-link-list">
            <a
              className="footer-link"
              href="https://docs.metamask.io/snaps/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask Snaps Docs
            </a>
            <a
              className="footer-link"
              href="https://base.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Base Network
            </a>
            <a
              className="footer-link"
              href="https://docs.metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask Docs
            </a>
            <a
              className="footer-link"
              href="https://github.com/Gainjar_payroll/mbg-snap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© 2026 MBG. Built with MetaMask, 1Shot, Venice AI, x402.</span>
        <span className="footer-pill">USDC · WETH · cbBTC · Base Sepolia</span>
      </div>
    </footer>
  );
};
