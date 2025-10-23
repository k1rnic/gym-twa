import { ConfigProvider } from 'antd';
import ruLocale from 'antd/locale/ru_RU';
import { PropsWithChildren } from 'react';
import { BASE_THEME_CONFIG } from '../config/base';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      locale={ruLocale}
      componentSize="small"
      input={{ variant: 'filled' }}
      inputNumber={{ variant: 'filled' }}
      textArea={{ variant: 'filled' }}
      select={{ variant: 'filled' }}
      theme={BASE_THEME_CONFIG}
      renderEmpty={() => <></>}
    >
      {children}
    </ConfigProvider>
  );
};
