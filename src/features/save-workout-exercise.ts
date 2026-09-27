import { normalizeSetValues, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { buildGroupRestUpdates } from './sync-workout-group-rest';

/** Признак того, что в форме поменяли время отдыха упражнения */
export const isRestChanged = (
  task: workoutModel.WorkoutExercise,
  values: workoutModel.WorkoutExercise,
) => {
  const rest = values.task_properties?.rest;

  return rest !== undefined && rest !== (task.task_properties?.rest ?? null);
};

const resolveGroupTasks = async (
  workout: workoutModel.Workout,
  exercise: workoutModel.WorkoutExercise,
): Promise<workoutModel.WorkoutExercise[]> => {
  const blockId = exercise.task_group_block_id;
  if (blockId == null) return [];

  const group = workout.groups?.find(
    (item) => item.task_group_block_id === blockId,
  );
  const memberIds = group?.task_ids ?? [];

  const members = (workout.tasks ?? []).filter(
    (task) => task.task_group_block_id === blockId,
  );

  const missingIds = memberIds.filter(
    (taskId) => !members.some((task) => task.task_id === taskId),
  );

  if (!missingIds.length) return members;

  const fetched = await Promise.all(
    missingIds.map((taskId) => Api.task.getTaskByTaskId(taskId)),
  );

  return [
    ...members,
    ...fetched.filter(
      (task): task is workoutModel.WorkoutExercise => Boolean(task),
    ),
  ];
};

/** Заменяет время отдыха у всех упражнений группы упражнения */
export const updateWorkoutGroupRest = async (
  workout: workoutModel.Workout,
  exercise: workoutModel.WorkoutExercise,
  rest: number | null,
) => {
  const groupTasks = await resolveGroupTasks(workout, exercise);

  const updates = buildGroupRestUpdates(
    groupTasks.filter((task) => task.task_id !== exercise.task_id),
    rest,
  );

  await Promise.all(updates.map((update) => Api.task.updateTask(update)));
};

/** Сохраняет изменения упражнения, синхронизируя отдых внутри группы */
export const saveWorkoutExercise = async (
  workout: workoutModel.Workout,
  exercise: workoutModel.WorkoutExercise,
  values: workoutModel.WorkoutExercise,
) => {
  await Api.task.updateTask(normalizeSetValues(values));

  if (!isRestChanged(exercise, values)) return;

  try {
    await updateWorkoutGroupRest(
      workout,
      exercise,
      values.task_properties?.rest ?? null,
    );
  } catch (e) {
    console.error('Failed to sync workout group rest', e);
  }
};
