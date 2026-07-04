import { isTMA, mockTelegramEnv } from '@tma.js/sdk-react';
import { DEFAULT_LIGHT_THEME } from '../model/constants';

if (import.meta.env.DEV) {
  const isInContext = await isTMA('complete');

  if (!isInContext) {
    mockTelegramEnv({
      launchParams: new URLSearchParams([
        ['tgWebAppThemeParams', JSON.stringify(DEFAULT_LIGHT_THEME)],
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
                // id: 542590850,
                first_name: '',
                username: '',
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
