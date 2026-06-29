import { ComponentType, useEffect } from 'react';

import { ThemeProvider, useTheme } from '@/shared/lib/theme';

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
        <InjectedStyles />
        <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
      </ThemeProvider>
    );
