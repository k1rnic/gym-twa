import { startTransition, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { getLocalStorageValue } from '@/shared/lib/hooks';
import { initTgMiniApp } from '@/shared/lib/telegram';
import { HydratedRouter } from 'react-router/dom';

import './global.css';

const resolveBootstrapLanguage = () => {
  const stored = getLocalStorageValue<string | null>('app-language', null);

  if (stored) {
    return stored;
  }

  const browserLanguage = window.navigator.language?.toLowerCase() ?? '';

  return browserLanguage.startsWith('ru') ? 'ru' : 'en';
};

const getUnsupportedEnvMessage = async () => {
  const candidates = [
    resolveBootstrapLanguage(),
    'ru',
    'en',
  ].filter((value, index, list) => list.indexOf(value) === index);

  for (const language of candidates) {
    try {
      const response = await fetch(`/locales/${language}.json`);

      if (!response.ok) {
        continue;
      }

      const locale = await response.json();
      const message = locale?.errors?.unsupportedEnv;

      if (typeof message === 'string' && message) {
        return message;
      }
    } catch {
      // try next language
    }
  }

  return null;
};

initTgMiniApp()
  .then(() => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <HydratedRouter />
        </StrictMode>,
      );
    });
  })
  .catch(async () => {
    const message = await getUnsupportedEnvMessage();

    createRoot(document.getElementsByTagName('body')[0]).render(
      <>{message}</>,
    );
  });
