import { RetrieveLaunchParamsResult } from '@tma.js/sdk-react';

export type TgLaunchParams = RetrieveLaunchParamsResult;
export type TgWebAppData = Required<TgLaunchParams>['tgWebAppData'];
export type TgWebAppThemeParams =
  Required<TgLaunchParams>['tgWebAppThemeParams'];
export type TgUser = Required<TgWebAppData>['user'];
