import { ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import { BASE_THEME_CONFIG } from '../config/base';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return <ConfigProvider theme={BASE_THEME_CONFIG}>{children}</ConfigProvider>;
};
