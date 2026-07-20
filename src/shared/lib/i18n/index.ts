import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export type LanguageOption = {
  code: string;
  name: string;
  nativeName: string;
};

export type LanguagesResponse = {
  defaultLanguage: string;
  languages: LanguageOption[];
};

export const DEFAULT_LANGUAGE = 'ru';

export const getI18nNamespace = () => 'translation';

const normalizeCode = (value?: string | null) =>
  value?.trim().toLowerCase() || '';

export const normalizeLanguage = (
  language: string | null | undefined,
  availableLanguages: string[] = [],
  fallbackLanguage = DEFAULT_LANGUAGE,
) => {
  const fallback = normalizeCode(fallbackLanguage);
  const available = availableLanguages.map(normalizeCode);

  if (!available.length) {
    return fallback;
  }

  const normalized = normalizeCode(language);

  if (available.includes(normalized)) {
    return normalized;
  }

  const baseLanguage = normalized.split('-')[0];
  if (available.includes(baseLanguage)) {
    return baseLanguage;
  }

  if (available.includes(fallback)) {
    return fallback;
  }

  return available[0] ?? fallback;
};

export const getAvailableLanguages = async (): Promise<LanguagesResponse> => {
  try {
    const response = await fetch('/locales/languages.json');

    if (!response.ok) {
      return {
        defaultLanguage: DEFAULT_LANGUAGE,
        languages: [],
      };
    }

    const payload = await response.json();

    return {
      defaultLanguage: payload.defaultLanguage || DEFAULT_LANGUAGE,
      languages: Array.isArray(payload.languages) ? payload.languages : [],
    };
  } catch (error) {
    console.error('Failed to load available languages', error);

    return {
      defaultLanguage: DEFAULT_LANGUAGE,
      languages: [],
    };
  }
};

export const getBrowserLanguage = (
  availableLanguages: string[],
  fallbackLanguage = DEFAULT_LANGUAGE,
) => {
  if (typeof window === 'undefined') {
    return fallbackLanguage;
  }

  const browserLanguages = [
    ...(window.navigator.languages ?? []),
    window.navigator.language,
  ]
    .filter(Boolean)
    .map(normalizeCode);

  const directMatch = browserLanguages.find((language) =>
    availableLanguages.includes(language),
  );

  if (directMatch) {
    return directMatch;
  }

  const baseMatch = browserLanguages
    .map((language) => language.split('-')[0])
    .find((language) => availableLanguages.includes(language));

  return normalizeLanguage(baseMatch, availableLanguages, fallbackLanguage);
};

type InitI18nOptions = {
  initialLanguage?: string;
  fallbackLanguage?: string;
  supportedLanguages?: string[];
};

export const initI18n = async (options: InitI18nOptions = {}) => {
  if (i18next.isInitialized) {
    return i18next;
  }

  const supportedLanguages =
    options.supportedLanguages?.map(normalizeCode) ?? [];

  const fallbackLanguage = normalizeLanguage(
    options.fallbackLanguage,
    supportedLanguages,
    DEFAULT_LANGUAGE,
  );

  const initialLanguage = normalizeLanguage(
    options.initialLanguage,
    supportedLanguages,
    fallbackLanguage,
  );

  await i18next.use(initReactI18next).init({
    resources: {},
    lng: initialLanguage,
    fallbackLng: fallbackLanguage,
    supportedLngs: supportedLanguages,
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
    ns: [getI18nNamespace()],
    defaultNS: getI18nNamespace(),
    react: {
      useSuspense: false,
    },
  });

  return i18next;
};

export const loadLocale = async (language: string) => {
  const namespace = getI18nNamespace();

  if (i18next.hasResourceBundle(language, namespace)) {
    return i18next.getResourceBundle(language, namespace);
  }

  const response = await fetch(`/locales/${language}.json`);

  if (!response.ok) {
    throw new Error(`Locale not found: ${language}`);
  }

  const locale = await response.json();

  i18next.addResourceBundle(language, namespace, locale, true, true);

  return locale;
};

export const changeLanguage = async (language: string) => {
  const supportedLanguages = Array.isArray(i18next.options.supportedLngs)
    ? i18next.options.supportedLngs
    : [];

  const fallbackLanguage =
    typeof i18next.options.fallbackLng === 'string'
      ? i18next.options.fallbackLng
      : DEFAULT_LANGUAGE;

  const resolvedLanguage = normalizeLanguage(
    language,
    supportedLanguages,
    fallbackLanguage,
  );

  await loadLocale(resolvedLanguage);

  if (i18next.language !== resolvedLanguage) {
    await i18next.changeLanguage(resolvedLanguage);
  }

  return {
    language: resolvedLanguage,
    locale: i18next.getResourceBundle(resolvedLanguage, getI18nNamespace()),
  };
};

export const getCurrentLanguage = () =>
  normalizeLanguage(
    i18next.language,
    Array.isArray(i18next.options.supportedLngs)
      ? i18next.options.supportedLngs
      : [],
    DEFAULT_LANGUAGE,
  );
