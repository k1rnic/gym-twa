import { ThemeConfig, theme } from 'antd';

export type ThemeCode = string;

export type ThemeAlgorithmName = 'default' | 'dark' | 'compact';

/**
 * Shape served by the theme source.
 * `algorithm` arrives as a name because a JSON file cannot carry a function.
 */
export type ThemeTokens = Omit<ThemeConfig, 'algorithm' | 'cssVar'> & {
  algorithm?: ThemeAlgorithmName | ThemeAlgorithmName[];
};

export type ThemeOption = {
  code: ThemeCode;
};

export type ThemesIndex = {
  defaultTheme: ThemeCode;
  themes: ThemeOption[];
};

export const normalizeThemeCode = (value?: string | null) =>
  value?.trim().toLowerCase() || '';

export const resolveThemeCode = (
  code: string | null | undefined,
  availableThemes: ThemeCode[] = [],
  fallbackTheme: ThemeCode = '',
) => {
  const fallback = normalizeThemeCode(fallbackTheme);
  const available = availableThemes.map(normalizeThemeCode);

  if (!available.length) {
    return fallback;
  }

  const normalized = normalizeThemeCode(code);

  if (available.includes(normalized)) {
    return normalized;
  }

  if (available.includes(fallback)) {
    return fallback;
  }

  return available[0] ?? fallback;
};

const THEME_ALGORITHMS: Record<ThemeAlgorithmName, ThemeConfig['algorithm']> =
  {
    default: theme.defaultAlgorithm,
    dark: theme.darkAlgorithm,
    compact: theme.compactAlgorithm,
  };

export const resolveThemeAlgorithm = (value?: ThemeTokens['algorithm']) => {
  const names: ThemeAlgorithmName[] = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  return names
    .map((name) => THEME_ALGORITHMS[name])
    .filter(Boolean) as ThemeConfig['algorithm'];
};

export const toThemeConfig = (tokens: ThemeTokens): ThemeConfig => {
  const { algorithm, ...rest } = tokens;
  const resolved = resolveThemeAlgorithm(algorithm);

  return {
    ...rest,
    ...(resolved ? { algorithm: resolved } : {}),
  };
};
