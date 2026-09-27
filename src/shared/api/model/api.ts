import type { Token } from './endpoints';
import { Endpoints } from './endpoints';

export const Api = new Endpoints<Token>({
  baseURL: import.meta.env.APP_API_BASE_URL,
  securityWorker: (token) =>
    token
      ? {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      : {},
});
