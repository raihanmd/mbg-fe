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
  padding: 1.1rem 2.4rem;
  background:
    linear-gradient(90deg, rgba(7, 10, 18, 0.92), rgba(15, 23, 42, 0.82)),
    rgba(7, 10, 18, 0.86);
  backdrop-filter: blur(18px) saturate(160%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  color: #ffffff;

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1rem 1.2rem;
  }
`;

const Brand = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.85rem;
  color: #ffffff;
  text-decoration: none;
`;

const LogoShell = styled.div`
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border: 1px solid rgba(103, 232, 249, 0.35);
  border-radius: 1rem;
  background: rgba(103, 232, 249, 0.12);
  box-shadow: 0 0 30px rgba(103, 232, 249, 0.16);
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
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.span`
  margin-top: 0.2rem;
  color: rgb(148, 163, 184);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
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
  gap: 0.4rem;

  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const NavLink = styled(Link)`
  border: 1px solid transparent;
  border-radius: 999px;
  color: rgb(226, 232, 240);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.65rem 0.95rem;
  text-decoration: none;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(103, 232, 249, 0.28);
    color: rgb(165, 243, 252);
  }
`;

export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick: () => void;
}) => {
  return (
    <HeaderWrapper>
      <Brand to="/">
        <LogoShell>
          <SnapLogo color="rgb(103, 232, 249)" size={24} />
        </LogoShell>
        <BrandText>
          <Title>MBG</Title>
          <Subtitle>MetaMask Based Gigs</Subtitle>
        </BrandText>
      </Brand>

      <RightContainer>
        <Nav aria-label="Primary navigation">
          <NavLink to="/#how-to-use">Browser Extension</NavLink>
          <NavLink to="/#skills">Skills</NavLink>
          <NavLink to="/#configuration">Configuration</NavLink>
          <NavLink to="/#faq">FAQ</NavLink>
        </Nav>
        <HeaderButtons />
      </RightContainer>
    </HeaderWrapper>
  );
};
