import { ThemeConfig } from 'antd';
import {
  normalizeThemeCode,
  ThemeCode,
  ThemesIndex,
  ThemeTokens,
  toThemeConfig,
} from '../model';

const THEMES_INDEX_URL = '/themes/themes.json';
const THEME_TOKENS_URL = (code: ThemeCode) =>
  `/themes/${encodeURIComponent(code)}.json`;

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${url} (${response.status})`);
  }

  return response.json() as Promise<T>;
};

export const getThemes = async (): Promise<ThemesIndex> => {
  const payload = await fetchJson<Partial<ThemesIndex>>(THEMES_INDEX_URL);

  return {
    defaultTheme: normalizeThemeCode(payload?.defaultTheme),
    themes: Array.isArray(payload?.themes)
      ? payload.themes
          .map(({ code }) => normalizeThemeCode(code))
          .filter(Boolean)
          .map((code) => ({ code }))
      : [],
  };
};

export const getThemeTokens = (code: ThemeCode): Promise<ThemeConfig> =>
  fetchJson<ThemeTokens>(THEME_TOKENS_URL(code)).then(toThemeConfig);
