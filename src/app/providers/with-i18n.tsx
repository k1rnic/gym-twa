import { useLocalStorage } from '@/shared/lib/hooks';
import {
  changeLanguage,
  DEFAULT_LANGUAGE,
  getAvailableLanguages,
  getBrowserLanguage,
  initI18n,
  LanguageOption,
  normalizeLanguage,
} from '@/shared/lib/i18n';
import i18next from 'i18next';
import {
  ComponentType,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nextProvider } from 'react-i18next';

type I18nContextValue = {
  language: string;
  setLanguage: (value: string) => Promise<void>;
  ready: boolean;
  languages: LanguageOption[];
  defaultLanguage: string;
};

const I18nContext = createContext<I18nContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: async () => {},
  ready: false,
  languages: [],
  defaultLanguage: DEFAULT_LANGUAGE,
});

export const useI18nContext = () => useContext(I18nContext);

const LANGUAGE_STORAGE_KEY = 'app-language';

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedLanguage, setStoredLanguage] = useLocalStorage<string | null>(
    LANGUAGE_STORAGE_KEY,
    null,
  );

  const [activeLanguage, setActiveLanguage] =
    useState<string>(DEFAULT_LANGUAGE);

  const [ready, setReady] = useState(false);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const response = await getAvailableLanguages();
        const supportedLanguages = response.languages.map(({ code }) => code);
        const fallbackLanguage = normalizeLanguage(
          response.defaultLanguage,
          supportedLanguages,
          DEFAULT_LANGUAGE,
        );

        const initialLanguage = storedLanguage
          ? normalizeLanguage(
              storedLanguage,
              supportedLanguages,
              fallbackLanguage,
            )
          : getBrowserLanguage(supportedLanguages, fallbackLanguage);

        await initI18n({
          initialLanguage,
          supportedLanguages,
          fallbackLanguage,
        });

        await changeLanguage(initialLanguage);

        if (!mounted) {
          return;
        }

        setLanguages(response.languages);
        setDefaultLanguage(fallbackLanguage);
        setActiveLanguage(initialLanguage);

        if (storedLanguage !== initialLanguage) {
          setStoredLanguage(initialLanguage);
        }
      } catch (error) {
        console.error('Failed to initialize i18n', error);
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
    // Resolve language once on mount from storage / browser
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    document.documentElement.lang = activeLanguage;
    document.title = i18next.t('common.appTitle');
  }, [activeLanguage, ready]);

  const setLanguage = useCallback(
    async (value: string) => {
      const nextLanguage = normalizeLanguage(
        value,
        languages.map(({ code }) => code),
        defaultLanguage,
      );

      if (nextLanguage === activeLanguage) {
        return;
      }

      await changeLanguage(nextLanguage);

      setStoredLanguage(nextLanguage);
      setActiveLanguage(nextLanguage);
    },
    [activeLanguage, defaultLanguage, languages, setStoredLanguage],
  );

  const contextValue = useMemo<I18nContextValue>(
    () => ({
      language: activeLanguage,
      setLanguage,
      ready,
      languages,
      defaultLanguage,
    }),
    [activeLanguage, defaultLanguage, languages, ready, setLanguage],
  );

  if (!ready) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18next}>
      <I18nContext.Provider value={contextValue}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  );
};

export const withI18n =
  <T,>(Component: ComponentType<T>) =>
  (props: T) =>
    (
      <I18nProvider>
        <Component {...(props as T & JSX.IntrinsicAttributes)} />
      </I18nProvider>
    );
