import {
  backButton,
  closingBehavior,
  initData,
  init as initSDK,
  isTMA,
  setDebug,
  swipeBehavior,
  viewport,
} from '@tma.js/sdk-react';

let telegramMiniApp = false;

export const isTelegramMiniApp = () => telegramMiniApp;

export async function init(): Promise<void> {
  telegramMiniApp = await isTMA('complete');

  if (import.meta.env.DEV && !telegramMiniApp) {
    await import('./mock-env.client');
  }

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
