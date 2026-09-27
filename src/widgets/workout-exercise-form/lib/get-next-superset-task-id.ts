import { workoutModel } from '@/entities/workout';

/**
 * task_id следующего упражнения группы или null,
 * если упражнение последнее в группе либо не входит в неё
 */
export const getNextSupersetTaskId = (
  workout: workoutModel.Workout,
  exercise: workoutModel.WorkoutExercise,
): number | null => {
  const blockId = exercise.task_group_block_id;
  if (blockId == null) return null;

  const members = (workout.tasks ?? [])
    .filter((task) => task.task_group_block_id === blockId)
    .sort(
      (a, b) => (a.order_idx ?? 0) - (b.order_idx ?? 0) || a.task_id - b.task_id,
    );

  const index = members.findIndex((task) => task.task_id === exercise.task_id);
  if (index === -1) return null;

  return members[index + 1]?.task_id ?? null;
};
