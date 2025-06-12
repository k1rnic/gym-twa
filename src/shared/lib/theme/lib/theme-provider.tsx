import { ConfigProvider } from 'antd';
import ruLocale from 'antd/locale/ru_RU';
import { PropsWithChildren } from 'react';
import { BASE_THEME_CONFIG } from '../config/base';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      locale={ruLocale}
      componentSize="small"
      theme={BASE_THEME_CONFIG}
      renderEmpty={() => <></>}
    >
      {children}
    </ConfigProvider>
  );
};
