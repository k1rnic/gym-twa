import {
  index,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  route('/', '../pages/main-layout.tsx', [
    route('workouts', '../pages/workout-layout.tsx', [
      route(':gId/:status', '../pages/workouts.tsx', [
        route(':wId/details', '../pages/workout-details.tsx', [
          route(':exId', '../pages/exercise-instance-details.tsx'),
        ]),
        route(':wId/gym', '../pages/workout-gym.tsx', [
          route(':exId', '../pages/exercise-instance-gym.tsx'),
        ]),
      ]),
    ]),
    ...prefix('exercises', [
      index('../pages/exercises.tsx'),
      route(':exId', '../pages/exercise-details.tsx'),
    ]),
    ...prefix('profile', [
      index('../pages/profile.tsx'),
      ...prefix('masters', [
        index('../pages/profile-masters.tsx'),
        route(':masterId', '../pages/master-details.tsx'),
      ]),
      route('requests', '../pages/profile-requests.tsx'),
      route('gymmers', '../pages/profile-gymmers.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
