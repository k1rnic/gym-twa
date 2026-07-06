import {
  index,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  route('/', '../pages/layout.tsx', [
    ...prefix('workouts', [
      route('', '../pages/workout-layout.tsx', [
        route(':gId/:status', '../pages/workouts.tsx'),
      ]),
      ...prefix(':gId/:status/:wId', [
        index('../pages/workout-by-id.tsx'),
        route(':exId', '../pages/workout-exercise-by-id.tsx'),
      ]),
    ]),
    ...prefix('exercises', [
      index('../pages/exercises.tsx'),
      route(':exId', '../pages/exercise-by-id.tsx'),
    ]),
    ...prefix('profile', [
      index('../pages/profile.tsx'),
      ...prefix('masters', [
        index('../pages/profile-masters.tsx'),
        route(':masterId', '../pages/master-by-id.tsx'),
      ]),
      route('requests', '../pages/profile-requests.tsx'),
      ...prefix('gymmers', [
        index('../pages/profile-gymmers.tsx'),
        route(':userId', '../pages/gymmer-by-id.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
