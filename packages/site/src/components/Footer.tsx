import { Link } from "gatsby";
import styled from "styled-components";

import { SnapLogo } from "./SnapLogo";

const FooterWrapper = styled.footer`
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  background:
    radial-gradient(circle at 20% 0%, rgba(56, 189, 248, 0.14), transparent 32rem),
    radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.08), transparent 30rem),
    #070b12;
  color: #f8fafc;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.8fr;
  gap: 2rem;
  max-width: 80rem;
  margin: 0 auto;
  padding: 4rem 2.4rem 2rem;

  ${({ theme }) => theme.mediaQueries.medium} {
    grid-template-columns: 1fr;
  }

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 3rem 1.2rem 1.5rem;
  }
`;

const Brand = styled.div`
  max-width: 30rem;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const LogoShell = styled.div`
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 0.625rem;
  background: rgba(56, 189, 248, 0.12);
`;

const Title = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
`;

const Description = styled.p`
  margin: 1.25rem 0 0;
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.7;
`;

const ColumnTitle = styled.p`
  margin: 0 0 1rem;
  color: rgb(165, 243, 252);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const FooterLink = styled(Link)`
  color: rgb(226, 232, 240);
  font-weight: 700;
  text-decoration: none;
  transition: color 160ms ease;

  &:hover {
    color: rgb(103, 232, 249);
  }
`;

const ExternalLink = styled.a`
  color: rgb(226, 232, 240);
  font-weight: 700;
  text-decoration: none;
  transition: color 160ms ease;

  &:hover {
    color: rgb(103, 232, 249);
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.4rem 2.4rem 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  color: #64748b;
  font-size: 0.8rem;

  ${({ theme }) => theme.mediaQueries.small} {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.4rem 1.2rem 2rem;
  }
`;

const Pill = styled.span`
  border: 1px solid rgba(103, 232, 249, 0.22);
  border-radius: 999px;
  background: rgba(103, 232, 249, 0.08);
  color: rgb(207, 250, 254);
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.55rem 0.8rem;
`;

export const Footer = () => {
  return (
    <FooterWrapper>
      <Content>
        <Brand>
          <BrandRow>
            <LogoShell>
              <SnapLogo color="rgb(103, 232, 249)" size={24} />
            </LogoShell>
            <Title>SkillWallet*</Title>
          </BrandRow>
          <Description>
            A permissioned skill runtime for MetaMask Smart Accounts. Install
            skills, set limits, and let the backend execute approved actions —
            with optional Venice AI reasoning and x402 data.
          </Description>
        </Brand>

        <div>
          <ColumnTitle>Product</ColumnTitle>
          <LinkList>
            <FooterLink to="/#skills">Skills</FooterLink>
            <FooterLink to="/#how-to-use">How It Works</FooterLink>
            <FooterLink to="/#security">Security</FooterLink>
            <FooterLink to="/#configuration">Configuration</FooterLink>
            <FooterLink to="/#pillars">Design Principles</FooterLink>
          </LinkList>
        </div>

        <div>
          <ColumnTitle>Resources</ColumnTitle>
          <LinkList>
            <ExternalLink
              href="https://docs.metamask.io/snaps/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask Snaps Docs
            </ExternalLink>
            <ExternalLink
              href="https://base.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Base Network
            </ExternalLink>
            <ExternalLink
              href="https://docs.metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask Docs
            </ExternalLink>
            <ExternalLink
              href="https://github.com/Gainjar_payroll/mbg-snap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </ExternalLink>
          </LinkList>
        </div>
      </Content>

      <BottomBar>
        <span>© 2026 MBG. Built with MetaMask, 1Shot, Venice AI, x402.</span>
        <Pill>USDC · WETH · cbBTC · Base Sepolia</Pill>
      </BottomBar>
    </FooterWrapper>
  );
};