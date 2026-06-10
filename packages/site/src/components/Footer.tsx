import { Link } from "gatsby";
import styled from "styled-components";

import { SnapLogo } from "./SnapLogo";

const FooterWrapper = styled.footer`
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background:
    radial-gradient(circle at 20% 0%, rgba(103, 232, 249, 0.16), transparent 32rem),
    radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.14), transparent 30rem),
    #070a12;
  color: #ffffff;
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
  border: 1px solid rgba(103, 232, 249, 0.35);
  border-radius: 1rem;
  background: rgba(103, 232, 249, 0.12);
`;

const Title = styled.p`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 900;
`;

const Description = styled.p`
  margin: 1.25rem 0 0;
  color: rgb(203, 213, 225);
  font-size: 1rem;
  line-height: 1.8;
`;

const ColumnTitle = styled.p`
  margin: 0 0 1rem;
  color: rgb(165, 243, 252);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.2em;
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
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgb(148, 163, 184);
  font-size: 0.9rem;

  ${({ theme }) => theme.mediaQueries.small} {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.4rem 1.2rem 2rem;
  }
`;

const Pill = styled.span`
  border: 1px solid rgba(103, 232, 249, 0.25);
  border-radius: 999px;
  background: rgba(103, 232, 249, 0.08);
  color: rgb(207, 250, 254);
  font-size: 0.82rem;
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
            <Title>MetaMask Based Gigs</Title>
          </BrandRow>
          <Description>
            Install scoped AI agent skills for DCA execution. Configure USDC
            budgets, target assets, inbound triggers, and daily spend limits
            from a MetaMask Snap experience.
          </Description>
        </Brand>

        <div>
          <ColumnTitle>Product</ColumnTitle>
          <LinkList>
            <FooterLink to="/#how-to-use">Browser Extension</FooterLink>
            <FooterLink to="/#skills">AI Skills</FooterLink>
            <FooterLink to="/#how-to-use">How to Use</FooterLink>
            <FooterLink to="/#configuration">Configuration</FooterLink>
            <FooterLink to="/#security">Delegation Scope</FooterLink>
            <FooterLink to="/#faq">FAQ</FooterLink>
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
        <span>© 2026 MBG. Built for bounded AI-powered DCA automation.</span>
        <Pill>USDC · WETH · cbBTC · Base Sepolia</Pill>
      </BottomBar>
    </FooterWrapper>
  );
};
