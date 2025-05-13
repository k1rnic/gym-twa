import { ComponentType } from 'react';

import { ThemeProvider } from '@/shared/lib/theme';

export const withTheme =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) =>
    (
      <ThemeProvider>
        <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
      </ThemeProvider>
    );
