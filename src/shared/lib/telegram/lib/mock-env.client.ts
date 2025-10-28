import {
  emitEvent,
  isTMA,
  MethodName,
  mockTelegramEnv,
  SafeAreaInsets,
} from '@telegram-apps/sdk-react';
import { DEFAULT_LIGHT_THEME } from '../model/constants';

if (import.meta.env.DEV) {
  const isInContext = await isTMA('complete');

  if (!isInContext) {
    const noInsets: SafeAreaInsets = { left: 0, top: 0, bottom: 0, right: 0 };

    mockTelegramEnv({
      onEvent(e) {
        const ev = e[0] as MethodName;

        if (ev === 'web_app_request_theme') {
          return emitEvent('theme_changed', {
            theme_params: DEFAULT_LIGHT_THEME,
          });
        }
        if (ev === 'web_app_request_viewport') {
          return emitEvent('viewport_changed', {
            height: window.innerHeight,
            width: window.innerWidth,
            is_expanded: true,
            is_state_stable: true,
          });
        }
        if (ev === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets);
        }
        if (ev === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', noInsets);
        }
      },
      launchParams: new URLSearchParams([
        // Discover more launch parameters:
        // https://docs.telegram-mini-apps.com/platform/launch-parameters#parameters-list
        ['tgWebAppThemeParams', JSON.stringify(DEFAULT_LIGHT_THEME)],
        // Your init data goes here. Learn more about it here:
        // https://docs.telegram-mini-apps.com/platform/init-data#parameters-list
        //
        // Note that to make sure, you are using a valid init data, you must pass it exactly as it
        // is sent from the Telegram application. The reason is in case you will sort its keys
        // (auth_date, hash, user, etc.) or values your own way, init data validation will more
        // likely to fail on your server side. So, to make sure you are working with a valid init
        // data, it is better to take a real one from your application and paste it here. It should
        // look something like this (a correctly encoded URL search params):
        // ```
        // user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22...
        // ```
        // But in case you don't really need a valid init data, use this one:
        [
          'tgWebAppData',
          new URLSearchParams([
            ['auth_date', ((new Date().getTime() / 1000) | 0).toString()],
            ['hash', 'some-hash'],
            ['signature', 'some-signature'],
            [
              'user',
              JSON.stringify({
                id: 297913083,
                first_name: 'nik',
                username: 'k1r',
              }),
            ],
          ]).toString(),
        ],
        ['tgWebAppVersion', '8.4'],
        ['tgWebAppPlatform', 'tdesktop'],
      ]),
    });

    console.info(
      '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
    );
  }
}
