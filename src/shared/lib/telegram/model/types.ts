import { RetrieveLPResult } from '@telegram-apps/sdk-react';

export type TgLaunchParams = RetrieveLPResult;
export type TgWebAppData = Required<TgLaunchParams>['tgWebAppData'];
export type TgWebAppThemeParams =
  Required<TgLaunchParams>['tgWebAppThemeParams'];
export type TgUser = Required<TgWebAppData>['user'];
