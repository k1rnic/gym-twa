import { ComponentType, useEffect } from 'react';

import { ThemeProvider, useTheme } from '@/shared/lib/theme';
import { IconContext } from '@phosphor-icons/react';

function InjectedStyles() {
  const { token } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = token.colorBgContainer;
  }, [token.colorBgContainer]);

  return null;
}

export const withTheme =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) =>
    (
      <ThemeProvider>
        <IconContext.Provider value={{ weight: 'bold', size: 24 }}>
          <InjectedStyles />
          <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
        </IconContext.Provider>
      </ThemeProvider>
    );
