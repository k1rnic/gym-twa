import { getAntdLocale } from '@/shared/lib/i18n/antd';
import { ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { BASE_THEME_CONFIG } from '../config/base';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={getAntdLocale(i18n.resolvedLanguage || i18n.language)}
      componentSize="middle"
      variant="filled"
      theme={BASE_THEME_CONFIG}
      renderEmpty={() => <></>}
    >
      {children}
    </ConfigProvider>
  );
};
