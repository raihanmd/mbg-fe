import type { FunctionComponent, ReactNode } from 'react';
import { createContext } from 'react';
import { ThemeProvider } from 'styled-components';

import { dark } from './config/theme';
import { MetaMaskProvider } from './hooks';

export type RootProps = {
  children: ReactNode;
};

type ToggleTheme = () => void;

export const ToggleThemeContext = createContext<ToggleTheme>(
  (): void => undefined,
);

export const Root: FunctionComponent<RootProps> = ({ children }) => {

  return (
    <ToggleThemeContext.Provider value={() => {}}>
      <ThemeProvider theme={dark}>
        <MetaMaskProvider>{children}</MetaMaskProvider>
      </ThemeProvider>
    </ToggleThemeContext.Provider>
  );
};
