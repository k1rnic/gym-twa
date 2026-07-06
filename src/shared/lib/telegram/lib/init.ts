import {
  backButton,
  closingBehavior,
  initData,
  init as initSDK,
  setDebug,
  swipeBehavior,
  viewport,
} from '@tma.js/sdk-react';

if (import.meta.env.DEV) {
  await import('./mock-env.client');
}

export async function init(): Promise<void> {
  setDebug(import.meta.env.DEV);
  initSDK();

  initData.restore();

  viewport.mount().then(() => viewport.requestFullscreen());

  closingBehavior.mount();
  closingBehavior.enableConfirmation();

  swipeBehavior.mount();
  swipeBehavior.disableVertical();

  backButton.mount();
}
