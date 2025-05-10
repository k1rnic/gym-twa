import { useLaunchParams } from '@telegram-apps/sdk-react';
import { TgWebAppData } from './model';

const emptyTgWebAppData: TgWebAppData = {
  authDate: new Date(),
  hash: '',
  signature: '',
};

export const useTelegramData = (): TgWebAppData =>
  useLaunchParams(true).tgWebAppData ?? emptyTgWebAppData;
