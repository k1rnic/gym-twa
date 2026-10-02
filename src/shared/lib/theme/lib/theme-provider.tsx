import { useLocalStorage } from '@/shared/lib/hooks';
import { getAntdLocale } from '@/shared/lib/i18n/antd';
import { ConfigProvider, ThemeConfig } from 'antd';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FALLBACK_THEME_CONFIG } from '../config/fallback';
import { resolveThemeCode, ThemeCode } from '../model';
import { getThemes, getThemeTokens } from './theme-source';

export type ThemeSettingsValue = {
  themes: ThemeCode[];
  theme: ThemeCode;
  defaultTheme: ThemeCode;
  setTheme: (value: ThemeCode) => Promise<void>;
  ready: boolean;
};

const ThemeSettingsContext = createContext<ThemeSettingsValue>({
  themes: [],
  theme: '',
  defaultTheme: '',
  setTheme: async () => {},
  ready: false,
});

export const useThemes = () => useContext(ThemeSettingsContext);

const THEME_STORAGE_KEY = 'app-theme';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();

  const [storedTheme, setStoredTheme] = useLocalStorage<string | null>(
    THEME_STORAGE_KEY,
    null,
  );

  const [themes, setThemes] = useState<ThemeCode[]>([]);
  const [defaultTheme, setDefaultTheme] = useState<ThemeCode>('');
  const [activeTheme, setActiveTheme] = useState<ThemeCode>('');
  const [tokens, setTokens] = useState<ThemeConfig>(FALLBACK_THEME_CONFIG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const index = await getThemes();
        const availableThemes = index.themes.map(({ code }) => code);
        const initialTheme = resolveThemeCode(
          storedTheme || index.defaultTheme,
          availableThemes,
          index.defaultTheme,
        );

        const initialTokens = initialTheme
          ? await getThemeTokens(initialTheme)
          : FALLBACK_THEME_CONFIG;

        if (!mounted) {
          return;
        }

        setThemes(availableThemes);
        setDefaultTheme(index.defaultTheme);
        setActiveTheme(initialTheme);
        setTokens(initialTokens);

        if (storedTheme !== initialTheme) {
          setStoredTheme(initialTheme || null);
        }
      } catch (error) {
        console.error('Failed to initialize theme', error);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const setTheme = useCallback(
    async (value: ThemeCode) => {
      const nextTheme = resolveThemeCode(value, themes, defaultTheme);

      if (!nextTheme || nextTheme === activeTheme) {
        return;
      }

      setStoredTheme(nextTheme);
      setActiveTheme(nextTheme);

      try {
        setTokens(await getThemeTokens(nextTheme));
      } catch (error) {
        console.error(`Failed to load theme tokens: ${nextTheme}`, error);
        setTokens(FALLBACK_THEME_CONFIG);
      }
    },
    [activeTheme, defaultTheme, setStoredTheme, themes],
  );

  const settings = useMemo<ThemeSettingsValue>(
    () => ({
      themes,
      theme: activeTheme,
      defaultTheme,
      setTheme,
      ready,
    }),
    [activeTheme, defaultTheme, ready, setTheme, themes],
  );

  if (!ready) {
    return null;
  }

  return (
    <ThemeSettingsContext.Provider value={settings}>
      <ConfigProvider
        locale={getAntdLocale(i18n.resolvedLanguage || i18n.language)}
        componentSize="middle"
        variant="filled"
        theme={{ ...tokens, cssVar: true }}
        renderEmpty={() => <></>}
      >
        {children}
      </ConfigProvider>
    </ThemeSettingsContext.Provider>
  );
};
