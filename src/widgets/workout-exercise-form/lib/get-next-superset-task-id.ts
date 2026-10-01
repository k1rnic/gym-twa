import { workoutModel } from '@/entities/workout';

import { getGroupExercises } from './get-group-exercises';

/**
 * task_id следующего упражнения группы или null,
 * если упражнение последнее в группе либо не входит в неё
 */
export const getNextSupersetTaskId = (
  workout: workoutModel.Workout,
  exercise: workoutModel.WorkoutExercise,
): number | null => {
  const members = getGroupExercises(workout, exercise);
  if (!members.length) return null;

  const index = members.findIndex((task) => task.task_id === exercise.task_id);
  if (index === -1) return null;

  return members[index + 1]?.task_id ?? null;
};
