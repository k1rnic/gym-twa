import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('/', '../pages/main-layout.tsx', [
    route('master/:mId', '../pages/master-layout.tsx', [
      route(':gId', '../pages/master-gymmer-workouts.tsx', [
        route(':wId/new', '../pages/master-workout-ex-new.tsx'),
        route(':wId/:exId', '../pages/master-workout-ex-details.tsx'),
      ]),
    ]),
    route('gymmer/:gId', '../pages/gymmer-layout.tsx', [
      route('', '../pages/gymmer-workouts.tsx', [
        route(':wId', '../pages/gymmer-workout-gym.tsx'),
      ]),
    ]),
    route('exercises', '../pages/exercise-layout.tsx', [
      route('', '../pages/exercises.tsx'),
      route(':exId', '../pages/exercise-details.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
