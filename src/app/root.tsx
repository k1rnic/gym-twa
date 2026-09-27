import {
  AuthForbiddenError,
  authService,
  ConsentRequiredError,
} from '@/shared/lib/auth/auth-service';
import i18next from 'i18next';
import { PropsWithChildren } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  unstable_MiddlewareFunction,
} from 'react-router';
import { withProviders } from './providers';

const authMiddleware: unstable_MiddlewareFunction = async (_args, next) => {
  try {
    await authService.ensureAuthenticated();
    await next();
  } catch (error) {
    if (
      error instanceof ConsentRequiredError ||
      error instanceof AuthForbiddenError
    ) {
      return;
    }

    throw error;
  }
};

export const unstable_clientMiddleware = [authMiddleware];

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
