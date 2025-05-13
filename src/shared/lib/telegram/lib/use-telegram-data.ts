import { useLaunchParams } from '@telegram-apps/sdk-react';
import { TgWebAppData } from '../model';

const emptyTgWebAppData: TgWebAppData = {
  auth_date: new Date(),
  hash: '',
  signature: '',
};

export const useTelegramApi = () => useLaunchParams(false);

export const useTelegramData = () =>
  useTelegramApi().tgWebAppData ?? emptyTgWebAppData;

export const useTelegramTheme = () =>
  useTelegramApi().tgWebAppThemeParams ?? {};
