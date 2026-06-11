import { Link } from 'gatsby';
import styled from 'styled-components';

import { HeaderButtons } from './Buttons';
import { SnapLogo } from './SnapLogo';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  padding: 0 2.4rem;
  background:
    linear-gradient(90deg, rgba(7, 11, 18, 0.94), rgba(17, 24, 39, 0.88)),
    rgba(7, 11, 18, 0.9);
  backdrop-filter: blur(18px) saturate(160%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  color: #f8fafc;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 0 1.2rem;
  }
`;

const Brand = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.85rem;
  color: #f8fafc;
  text-decoration: none;
`;

const LogoShell = styled.div`
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 0.625rem;
  background: rgba(56, 189, 248, 0.12);
  box-shadow: 0 0 30px rgba(56, 189, 248, 0.16);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const Title = styled.span`
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.span`
  margin-top: 0.2rem;
  color: #94a3b8;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.2rem;

  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const NavLink = styled(Link)`
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: rgb(226, 232, 240);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.8rem;
  text-decoration: none;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(103, 232, 249, 0.28);
    color: rgb(165, 243, 252);
  }
`;

export const Header = () => {
  return (
    <HeaderWrapper>
      <Brand to="/">
        <LogoShell>
          <SnapLogo color="rgb(103, 232, 249)" size={24} />
        </LogoShell>
        <BrandText>
          <Title>SkillWallet*</Title>
          <Subtitle>Skill Runtime for Smart Accounts</Subtitle>
        </BrandText>
      </Brand>

      <RightContainer>
        <Nav aria-label="Primary navigation">
          <NavLink to="/#skills">Skills</NavLink>
          <NavLink to="/#how-to-use">How It Works</NavLink>
          <NavLink to="/#security">Security</NavLink>
          <NavLink to="/#configuration">Configuration</NavLink>
        </Nav>
        <HeaderButtons />
      </RightContainer>
    </HeaderWrapper>
  );
};