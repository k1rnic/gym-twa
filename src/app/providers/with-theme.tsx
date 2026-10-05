import { setMessageApi } from '@/shared/lib/message';
import { setNotificationApi } from '@/shared/lib/notification';
import { useViewport } from '@/shared/lib/telegram';
import { ThemeProvider, useTheme } from '@/shared/lib/theme';
import { IconContext } from '@phosphor-icons/react';
import { App } from 'antd';
import { ComponentType, PropsWithChildren, useEffect } from 'react';

function ApiBridge() {
  const { message, notification } = App.useApp();

  useEffect(() => {
    setMessageApi(message);
  }, [message]);

  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);

  return null;
}

function AppShell({ children }: PropsWithChildren) {
  const { token } = useTheme();
  const { topSafeArea } = useViewport();

  useEffect(() => {
    document.body.style.backgroundColor = token.colorBgContainer;
  }, [token.colorBgContainer]);

  return (
    <App
      style={{ height: '100%' }}
      message={{ top: topSafeArea + token.paddingMD }}
      notification={{ placement: 'bottom', duration: 3 }}
    >
      <ApiBridge />
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
