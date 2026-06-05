import styled, { useTheme } from 'styled-components';

import { HeaderButtons } from './Buttons';
import { SnapLogo } from './SnapLogo';
import { Link } from 'gatsby';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  /* Glassmorphism backdrop */
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px) saturate(150%);
  border-bottom: 1px solid var(--color-primary);
  color: var(--color-text);
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  color: var(--color-text);
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = ({
  handleToggleClick,
}: { handleToggleClick: () => void }) => {
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color="var(--color-primary)" size={36} />
        <Title>DCA Marketplace</Title>
      </LogoWrapper>
      <RightContainer>
        <nav className="hidden md:flex items-center gap-6 mr-6">
          <Link to="#" className="text-white text-bold hover:text-(--color-primary-light) font-medium transition-colors">
            Browser Extension
          </Link>
          <Link to="#" className="text-white text-bold   hover:text-(--color-primary-light) font-medium transition-colors">
            MetaMask Snap
          </Link>
        </nav>
        <HeaderButtons />
      </RightContainer>
    </HeaderWrapper>
  );
};
