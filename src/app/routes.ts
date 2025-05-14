import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('/', '../pages/main-layout.tsx', [
    route('coach/:id', '../pages/coach.tsx'),
    route('gymmer/:id', '../pages/gymmer.tsx'),
  ]),
] satisfies RouteConfig;
