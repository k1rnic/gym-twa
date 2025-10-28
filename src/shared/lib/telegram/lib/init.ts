import {
  bindThemeParamsCssVars,
  bindViewportCssVars,
  init as initSDK,
  mountBackButton,
  mountMiniAppSync,
  mountSwipeBehavior,
  mountViewport,
  restoreInitData,
  setDebug,
} from '@telegram-apps/sdk-react';

if (import.meta.env.DEV) {
  await import('./mock-env.client');
}

export async function init(): Promise<void> {
  setDebug(import.meta.env.DEV);
  initSDK();

  mountBackButton.ifAvailable();
  mountSwipeBehavior.ifAvailable();

  restoreInitData();

  if (mountMiniAppSync.isAvailable()) {
    mountMiniAppSync();
    bindThemeParamsCssVars();
  }
  if (mountViewport.isAvailable()) {
    mountViewport().then(() => {
      bindViewportCssVars();
    });
  }
}
