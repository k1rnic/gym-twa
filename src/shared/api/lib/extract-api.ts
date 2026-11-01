import path from 'path';
import { fileURLToPath } from 'url';

import { generateApi as generateApiBase } from 'swagger-typescript-api';

const baseUrl = process.env.APP_API_BASE_URL;

if (!baseUrl) {
  throw new Error(
    'APP_API_BASE_URL is not set. Run this script via `bun run api:extract` so that bun loads .env.development (or .env.production when NODE_ENV=production).',
  );
}

const username = process.env.SWAGGER_BASIC_AUTH_USER;
const password = process.env.SWAGGER_BASIC_AUTH_PASSWORD;

if (!username || !password) {
  throw new Error(
    'SWAGGER_BASIC_AUTH_USER and SWAGGER_BASIC_AUTH_PASSWORD are not set.\n' +
      'The OpenAPI spec is protected by HTTP Basic auth. Put the credentials into the git-ignored .env.local.',
  );
}

const specUrl = `${baseUrl}/openapi.json`;

const response = await fetch(specUrl, {
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
      'base64',
    )}`,
  },
});

if (!response.ok) {
  throw new Error(
    `Failed to fetch ${specUrl}: ${response.status} ${response.statusText}` +
      (response.status === 401 || response.status === 403
        ? '\nCheck SWAGGER_BASIC_AUTH_USER / SWAGGER_BASIC_AUTH_PASSWORD in .env.local.'
        : ''),
  );
}

const specification = (await response.json()) as Record<string, unknown>;

await generateApiBase({
  fileName: 'endpoints',
  apiClassName: 'Endpoints',
  spec: specification,
  output: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../model',
  ),
  httpClientType: 'axios',
  extractEnums: true,
  unwrapResponseData: true,
  moduleNameFirstTag: true,
  hooks: {
    onCreateRouteName: (route, rawRouteInfo) => {
      const routeTransformed = `${rawRouteInfo.route.replace(/[{}/]/g, '_')}_${
        rawRouteInfo.method
      }`;

      const operationIdSplit = rawRouteInfo.operationId
        .replace(routeTransformed, '')
        .split('_')
        .map((name, idx) =>
          idx === 0
            ? name.toLowerCase()
            : `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
        )
        .join('');

      route.original = operationIdSplit ?? route.original;
      route.usage = operationIdSplit ?? route.usage;

      return route;
    },
  },
});
