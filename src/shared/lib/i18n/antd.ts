import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import type { Locale } from 'antd/es/locale';

/** Map app language codes to Ant Design locales. Extend when adding languages. */
const antdLocales: Record<string, Locale> = {
  en: enUS,
  ru: ruRU,
};

export const getAntdLocale = (language: string): Locale =>
  antdLocales[language] ?? antdLocales.ru;
