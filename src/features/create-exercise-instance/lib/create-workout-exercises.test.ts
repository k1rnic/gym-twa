import { Api, TaskAggregate, TaskStatus } from '@/shared/api';
import { afterAll, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { createWorkoutExercises } from './create-workout-exercises';

type CreateQuery = {
  task_group_id: number;
  owner_id?: number | null;
  exercise_id?: number | null;
};

const makeTask = (taskId: number, exerciseId: number): TaskAggregate => ({
  task_id: taskId,
  task_group_id: 1,
  exercise_id: exerciseId,
  status: TaskStatus.Planned,
  create_dttm: '',
  update_dttm: null,
  order_idx: 0,
  owner_id: 2,
});

let queries: CreateQuery[] = [];
let failingExerciseIds: number[] = [];
let emptyExerciseIds: number[] = [];

const createTaskSpy = spyOn(Api.task, 'createTask').mockImplementation(((
  query: CreateQuery,
) => {
  queries.push(query);

  const exerciseId = query.exercise_id ?? 0;

  if (failingExerciseIds.includes(exerciseId)) {
    return Promise.reject(new Error('create failed'));
  }

  if (emptyExerciseIds.includes(exerciseId)) {
    return Promise.resolve(null);
  }

  return Promise.resolve(makeTask(100 + queries.length, exerciseId));
}) as typeof Api.task.createTask);

beforeEach(() => {
  queries = [];
  failingExerciseIds = [];
  emptyExerciseIds = [];
});

afterAll(() => {
  createTaskSpy.mockRestore();
});

describe('createWorkoutExercises', () => {
  test('creates a task of the workout for every selected exercise', async () => {
    const progress: [number, number][] = [];

    const result = await createWorkoutExercises({
      taskGroupId: 7,
      ownerId: 2,
      exerciseIds: [11, 12, 13],
      onProgress: (done, total) => progress.push([done, total]),
    });

    expect(result).toEqual({ created: [11, 12, 13], failed: [] });
    expect(queries).toEqual([
      { task_group_id: 7, owner_id: 2, exercise_id: 11 },
      { task_group_id: 7, owner_id: 2, exercise_id: 12 },
      { task_group_id: 7, owner_id: 2, exercise_id: 13 },
    ]);
    expect(progress).toEqual([
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });

  test('keeps going and reports the exercise that failed to be created', async () => {
    const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
    failingExerciseIds = [12];

    const result = await createWorkoutExercises({
      taskGroupId: 7,
      ownerId: 2,
      exerciseIds: [11, 12, 13],
    });

    expect(result).toEqual({ created: [11, 13], failed: [12] });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  test('reports the exercise when the task came back empty', async () => {
    const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
    emptyExerciseIds = [11];

    const result = await createWorkoutExercises({
      taskGroupId: 7,
      ownerId: 2,
      exerciseIds: [11],
    });

    expect(result).toEqual({ created: [], failed: [11] });
    consoleSpy.mockRestore();
  });

  test('reports progress for failed exercises as well', async () => {
    const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});
    const progress: [number, number][] = [];
    failingExerciseIds = [12];

    await createWorkoutExercises({
      taskGroupId: 7,
      ownerId: 2,
      exerciseIds: [11, 12],
      onProgress: (done, total) => progress.push([done, total]),
    });

    expect(progress).toEqual([
      [1, 2],
      [2, 2],
    ]);
    consoleSpy.mockRestore();
  });

  test('does nothing without selected exercises', async () => {
    const result = await createWorkoutExercises({
      taskGroupId: 7,
      ownerId: 2,
      exerciseIds: [],
    });

    expect(result).toEqual({ created: [], failed: [] });
    expect(queries).toEqual([]);
  });
});
