import {
  index,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  route('/', '../pages/main-layout.tsx', [
    route('workouts', '../pages/workout-layout.tsx', [
      route(':gId/:status', '../pages/workouts.tsx'),
      route(':gId/:status/:wId/details', '../pages/workout-details.tsx'),
      route(
        ':gId/:status/:wId/details/:exId',
        '../pages/exercise-instance-details.tsx',
      ),
      route(':gId/:status/:wId/gym', '../pages/workout-gym.tsx'),
      route(
        ':gId/:status/:wId/gym/:exId',
        '../pages/exercise-instance-gym.tsx',
      ),
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
