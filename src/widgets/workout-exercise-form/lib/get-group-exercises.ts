import { workoutModel } from '@/entities/workout';

/**
 * Упражнения группы, в которой находится упражнение, в порядке отображения.
 * Для упражнения вне группы список пустой.
 */
export const getGroupExercises = (
  workout: workoutModel.Workout,
  exercise: workoutModel.WorkoutExercise,
): workoutModel.WorkoutExercise[] => {
  const blockId = exercise.task_group_block_id;
  if (blockId == null) return [];

  return (workout.tasks ?? [])
    .filter((task) => task.task_group_block_id === blockId)
    .sort(
      (a, b) => (a.order_idx ?? 0) - (b.order_idx ?? 0) || a.task_id - b.task_id,
    );
};
