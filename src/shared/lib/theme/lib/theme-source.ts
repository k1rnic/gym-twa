import { Api } from '@/shared/api';
import { ThemeConfig } from 'antd';
import {
  normalizeThemeCode,
  ThemeCode,
  ThemesIndex,
  ThemeTokens,
  toThemeConfig,
} from '../model';

export const getThemes = async (): Promise<ThemesIndex> => {
  const response = await Api.theme.getThemes();

  return {
    defaultTheme: normalizeThemeCode(response?.defaultTheme),
    themes: Array.isArray(response?.themes)
      ? response.themes
          .map(({ code }) => normalizeThemeCode(code))
          .filter(Boolean)
          .map((code) => ({ code }))
      : [],
  };
};

export const getThemeTokens = async (code: ThemeCode): Promise<ThemeConfig> => {
  const { theme_data: themeData } = await Api.theme.getTheme(code);

  return toThemeConfig((themeData ?? {}) as ThemeTokens);
};
