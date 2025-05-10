import { RetrieveLPResultCamelCased } from '@telegram-apps/sdk-react';

export type TgLaunchParams = RetrieveLPResultCamelCased;
export type TgWebAppData = Required<TgLaunchParams>['tgWebAppData'];
export type TgUser = Required<TgWebAppData>['user'];
