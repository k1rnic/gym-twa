import path from 'path';
import { fileURLToPath } from 'url';

import { generateApi as generateApiBase } from 'swagger-typescript-api';

await generateApiBase({
  fileName: 'endpoints',
  apiClassName: 'Endpoints',
  url: `${process.env.APP_API_V2_BASE_URL}/openapi.json`,
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
