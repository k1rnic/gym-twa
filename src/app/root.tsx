import { withProviders } from './providers';
import i18next from 'i18next';
import { PropsWithChildren } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

export const Layout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={import.meta.env.DEV}>
    <head>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <title>Gym</title>
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

export const ErrorBoundary = () => <>{i18next.t('errors.unexpected')}</>;

export default withProviders(Outlet);
