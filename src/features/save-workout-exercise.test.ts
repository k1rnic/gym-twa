import type { workoutModel } from '@/entities/workout';
import {
  Api,
  TaskGroupBlockType,
  TaskGroupStatus,
  TaskPropertiesAggregate,
  TaskStatus,
  UpdateTask,
} from '@/shared/api';
import { afterAll, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { isRestChanged, saveWorkoutExercise } from './save-workout-exercise';

const makeProps = (
  taskId: number,
  rest: number | null,
): TaskPropertiesAggregate => ({
  task_properties_id: taskId,
  task_id: taskId,
  max_weight: 40,
  min_weight: 20,
  rest,
  sets: [
    {
      set_id: taskId,
      task_properties_id: taskId,
      plan_value: 30,
      plan_rep: 10,
      fact_value: null,
      fact_rep: null,
    },
  ],
});

const task = (
  partial: Partial<workoutModel.WorkoutExercise> &
    Pick<workoutModel.WorkoutExercise, 'task_id'>,
): workoutModel.WorkoutExercise => ({
  task_group_id: 1,
  exercise_id: partial.task_id,
  status: TaskStatus.Planned,
  create_dttm: '',
  update_dttm: null,
  order_idx: 0,
  owner_id: null,
  task_properties: makeProps(partial.task_id, 60),
  ...partial,
});

const workout = (
  tasks: workoutModel.WorkoutExercise[],
  taskIds: number[],
): workoutModel.Workout => ({
  task_group_id: 1,
  title: 'Leg day',
  master_id: 1,
  gymer_id: 2,
  status: TaskGroupStatus.Planned,
  create_dttm: '',
  update_dttm: null,
  start_dttm: null,
  order_idx: 0,
  owner_id: 2,
  tasks,
  groups: [
    {
      task_group_block_id: 10,
      task_group_id: 1,
      group_type: TaskGroupBlockType.Superset,
      task_ids: taskIds,
    },
  ],
});

let updatedTasks: UpdateTask[] = [];
let fetchedTasks = new Map<number, workoutModel.WorkoutExercise | null>();
let updateTaskImpl: (data: UpdateTask) => Promise<unknown> = (data) =>
  Promise.resolve(data);

const updateTaskSpy = spyOn(Api.task, 'updateTask').mockImplementation(((
  data: UpdateTask,
) => {
  updatedTasks.push(data);
  return updateTaskImpl(data);
}) as typeof Api.task.updateTask);

const getTaskSpy = spyOn(Api.task, 'getTaskByTaskId').mockImplementation(((
  taskId: number,
) => Promise.resolve(fetchedTasks.get(taskId) ?? null)) as typeof Api.task.getTaskByTaskId);

beforeEach(() => {
  updatedTasks = [];
  fetchedTasks = new Map();
  updateTaskImpl = (data) => Promise.resolve(data);
});

afterAll(() => {
  updateTaskSpy.mockRestore();
  getTaskSpy.mockRestore();
});

describe('isRestChanged', () => {
  test('detects changed, cleared and untouched rest values', () => {
    const exercise = task({ task_id: 2, task_group_block_id: 10 });

    expect(isRestChanged(exercise, exercise)).toBe(false);
    expect(
      isRestChanged(exercise, {
        ...exercise,
        task_properties: makeProps(2, 90),
      }),
    ).toBe(true);
    expect(
      isRestChanged(exercise, {
        ...exercise,
        task_properties: makeProps(2, null),
      }),
    ).toBe(true);
    expect(
      isRestChanged(exercise, {
        ...exercise,
        task_properties: { ...makeProps(2, 60), rest: undefined as never },
      }),
    ).toBe(false);
  });
});

describe('saveWorkoutExercise', () => {
  test('replaces the rest of every member of the superset', async () => {
    const edited = task({ task_id: 2, task_group_block_id: 10 });
    const sibling = task({
      task_id: 3,
      task_group_block_id: 10,
      task_properties: makeProps(3, 60),
    });
    const sameRest = task({
      task_id: 4,
      task_group_block_id: 10,
      task_properties: makeProps(4, 120),
    });
    const solo = task({ task_id: 5 });

    await saveWorkoutExercise(
      workout([edited, sibling, sameRest, solo], [2, 3, 4]),
      edited,
      { ...edited, task_properties: makeProps(2, 120) },
    );

    expect(updatedTasks.map((update) => update.task_id)).toEqual([2, 3]);
    expect(updatedTasks[1].task_properties?.rest).toBe(120);
    expect(updatedTasks[1].task_properties?.sets).toEqual([
      expect.objectContaining({ plan_value: 30, plan_rep: 10 }),
    ]);
  });

  test('touches nothing but the exercise when the rest was not changed', async () => {
    const edited = task({ task_id: 2, task_group_block_id: 10 });
    const sibling = task({ task_id: 3, task_group_block_id: 10 });

    await saveWorkoutExercise(
      workout([edited, sibling], [2, 3]),
      edited,
      { ...edited },
    );

    expect(updatedTasks.map((update) => update.task_id)).toEqual([2]);
  });

  test('does not propagate the rest of an exercise outside a group', async () => {
    const solo = task({ task_id: 7 });

    await saveWorkoutExercise(workout([solo], []), solo, {
      ...solo,
      task_properties: makeProps(7, 120),
    });

    expect(updatedTasks.map((update) => update.task_id)).toEqual([7]);
  });

  test('loads group members by ids when they are missing in the workout tasks', async () => {
    const edited = task({ task_id: 2, task_group_block_id: 10 });
    const sibling = task({
      task_id: 3,
      task_group_block_id: 10,
      task_properties: makeProps(3, 60),
    });

    fetchedTasks.set(3, sibling);
    fetchedTasks.set(4, null);

    await saveWorkoutExercise(
      workout([edited], [2, 3, 4]),
      edited,
      { ...edited, task_properties: makeProps(2, 120) },
    );

    expect([...fetchedTasks.keys()]).toEqual([3, 4]);
    expect(updatedTasks.map((update) => update.task_id)).toEqual([2, 3]);
  });

  test('keeps the saved exercise when a member update fails', async () => {
    const edited = task({ task_id: 2, task_group_block_id: 10 });
    const sibling = task({ task_id: 3, task_group_block_id: 10 });

    updateTaskImpl = (data) =>
      data.task_id === 3
        ? Promise.reject(new Error('403'))
        : Promise.resolve(data);

    const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});

    try {
      await saveWorkoutExercise(
        workout([edited, sibling], [2, 3]),
        edited,
        { ...edited, task_properties: makeProps(2, 120) },
      );

      expect(updatedTasks.map((update) => update.task_id)).toEqual([2, 3]);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    } finally {
      consoleSpy.mockRestore();
    }
  });
});


