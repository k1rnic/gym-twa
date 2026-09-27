import { normalizeSetValues, workoutModel } from '@/entities/workout';
import { Api, TaskPropertiesAggregateUpdate, UpdateTask } from '@/shared/api';

/** Общий отдых группы — первое заданное значение времени отдыха */
export const getWorkoutGroupRest = (
  tasks: workoutModel.WorkoutExercise[],
): number | null => {
  const member = tasks.find((task) => task.task_properties?.rest != null);

  return member?.task_properties?.rest ?? null;
};

const withRest = (
  task: workoutModel.WorkoutExercise,
  rest: number | null,
): UpdateTask => {
  const update = normalizeSetValues(task);

  const taskProperties: TaskPropertiesAggregateUpdate = update.task_properties
    ? { ...update.task_properties, rest }
    : { max_weight: null, min_weight: null, rest, sets: [] };

  return { ...update, task_properties: taskProperties };
};

/** Обновления для упражнений, у которых отдых отличается от общего */
export const buildGroupRestUpdates = (
  groupTasks: workoutModel.WorkoutExercise[],
  rest: number | null,
): UpdateTask[] =>
  groupTasks
    .filter((task) => (task.task_properties?.rest ?? null) !== rest)
    .map((task) => withRest(task, rest));

/** Проставляет всем упражнениям группы общее время отдыха */
export const applyWorkoutGroupRest = async (
  tasks: workoutModel.WorkoutExercise[],
) => {
  const updates = buildGroupRestUpdates(tasks, getWorkoutGroupRest(tasks));

  await Promise.all(updates.map((update) => Api.task.updateTask(update)));
};
