import { startTransition, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { initTgMiniApp } from '@/shared/lib/telegram';
import { HydratedRouter } from 'react-router/dom';

import './global.css';

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
  .catch(() => {
    createRoot(document.getElementsByTagName('body')[0]).render(
      <>Unsupported env...:(</>,
    );
  });
