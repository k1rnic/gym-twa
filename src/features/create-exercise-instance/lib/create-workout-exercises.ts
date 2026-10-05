import { Api } from '@/shared/api';

type CreateWorkoutExercisesParams = {
  taskGroupId: number;
  ownerId: number | null;
  exerciseIds: number[];
  onProgress?: (done: number, total: number) => void;
};

export type CreateWorkoutExercisesResult = {
  created: number[];
  failed: number[];
};

/**
 * Создаёт задачи тренировки для выбранных упражнений.
 * Запросы идут последовательно, чтобы можно было показать прогресс,
 * а частичные ошибки не мешали создать остальные упражнения.
 */
export const createWorkoutExercises = async ({
  taskGroupId,
  ownerId,
  exerciseIds,
  onProgress,
}: CreateWorkoutExercisesParams): Promise<CreateWorkoutExercisesResult> => {
  const created: number[] = [];
  const failed: number[] = [];

  let done = 0;

  for (const exerciseId of exerciseIds) {
    try {
      const task = await Api.task.createTask({
        task_group_id: taskGroupId,
        owner_id: ownerId,
        exercise_id: exerciseId,
      });

      if (!task) {
        throw new Error(`Task for exercise ${exerciseId} was not created`);
      }

      created.push(exerciseId);
    } catch (error) {
      console.error(`Failed to add exercise ${exerciseId} to workout`, error);
      failed.push(exerciseId);
    } finally {
      done += 1;
      onProgress?.(done, exerciseIds.length);
    }
  }

  return { created, failed };
};
