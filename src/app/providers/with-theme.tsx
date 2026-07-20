import { ComponentType, PropsWithChildren, useEffect } from 'react';

import { setNotificationApi } from '@/shared/lib/notification';
import { ThemeProvider, useTheme } from '@/shared/lib/theme';
import { IconContext } from '@phosphor-icons/react';
import { App } from 'antd';

function NotificationBridge() {
  const { notification } = App.useApp();

  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);

  return null;
}

function AppShell({ children }: PropsWithChildren) {
  const { token } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = token.colorBgContainer;
  }, [token.colorBgContainer]);

  return (
    <App
      style={{ height: '100%' }}
      notification={{ placement: 'bottom', duration: 3 }}
    >
      <NotificationBridge />
      {children}
    </App>
  );
}

export const withTheme =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) =>
    (
      <ThemeProvider>
        <IconContext.Provider value={{ weight: 'bold', size: 24 }}>
          <AppShell>
            <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
          </AppShell>
        </IconContext.Provider>
      </ThemeProvider>
    );
