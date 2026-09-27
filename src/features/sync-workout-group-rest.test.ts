import type { workoutModel } from '@/entities/workout';
import {
  Api,
  TaskPropertiesAggregate,
  TaskStatus,
  UpdateTask,
} from '@/shared/api';
import { afterAll, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import {
  applyWorkoutGroupRest,
  buildGroupRestUpdates,
  getWorkoutGroupRest,
} from './sync-workout-group-rest';

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

let updatedTasks: UpdateTask[] = [];
let updateTaskImpl: (data: UpdateTask) => Promise<unknown> = (data) =>
  Promise.resolve(data);

const updateTaskSpy = spyOn(Api.task, 'updateTask').mockImplementation(((
  data: UpdateTask,
) => {
  updatedTasks.push(data);
  return updateTaskImpl(data);
}) as typeof Api.task.updateTask);

beforeEach(() => {
  updatedTasks = [];
  updateTaskImpl = (data) => Promise.resolve(data);
});

afterAll(() => {
  updateTaskSpy.mockRestore();
});

describe('getWorkoutGroupRest', () => {
  test('returns the first defined rest of the group', () => {
    expect(
      getWorkoutGroupRest([
        task({ task_id: 1, task_group_block_id: 10 }),
        task({
          task_id: 2,
          task_group_block_id: 10,
          task_properties: makeProps(2, 90),
        }),
      ]),
    ).toBe(60);
  });

  test('skips members without a rest value', () => {
    expect(
      getWorkoutGroupRest([
        task({ task_id: 1, task_group_block_id: 10, task_properties: null }),
        task({
          task_id: 2,
          task_group_block_id: 10,
          task_properties: makeProps(2, 90),
        }),
      ]),
    ).toBe(90);
  });

  test('returns null when nobody set the rest', () => {
    expect(
      getWorkoutGroupRest([
        task({ task_id: 1, task_group_block_id: 10, task_properties: null }),
      ]),
    ).toBeNull();
    expect(getWorkoutGroupRest([])).toBeNull();
  });
});

describe('buildGroupRestUpdates', () => {
  test('updates only members with a different rest, keeping their sets', () => {
    const updates = buildGroupRestUpdates(
      [
        task({ task_id: 1, task_group_block_id: 10 }),
        task({
          task_id: 2,
          task_group_block_id: 10,
          task_properties: makeProps(2, 90),
        }),
        task({
          task_id: 3,
          task_group_block_id: 10,
          task_properties: makeProps(3, 120),
        }),
      ],
      90,
    );

    expect(updates.map((update) => update.task_id)).toEqual([1, 3]);
    expect(updates[0].exercise_id).toBe(1);
    expect(updates[0].status).toBe(TaskStatus.Planned);
    expect(updates[0].task_properties?.rest).toBe(90);
    expect(updates[0].task_properties?.sets).toEqual([
      expect.objectContaining({ plan_value: 30, plan_rep: 10 }),
    ]);
  });

  test('fills task properties of a member without them', () => {
    const [update] = buildGroupRestUpdates(
      [
        task({
          task_id: 1,
          task_group_block_id: 10,
          task_properties: null,
        }),
      ],
      90,
    );

    expect(update.task_properties).toEqual({
      max_weight: null,
      min_weight: null,
      rest: 90,
      sets: [],
    });
  });

  test('returns nothing when every member rests the same', () => {
    expect(
      buildGroupRestUpdates(
        [
          task({ task_id: 1, task_group_block_id: 10 }),
          task({ task_id: 2, task_group_block_id: 10 }),
        ],
        60,
      ),
    ).toEqual([]);
  });
});

describe('applyWorkoutGroupRest', () => {
  test('gives every member the first defined rest of the group', async () => {
    await applyWorkoutGroupRest([
      task({ task_id: 1, task_group_block_id: 10 }),
      task({
        task_id: 2,
        task_group_block_id: 10,
        task_properties: makeProps(2, 90),
      }),
      task({
        task_id: 3,
        task_group_block_id: 10,
        task_properties: null,
      }),
    ]);

    expect(updatedTasks.map((update) => update.task_id)).toEqual([2, 3]);
    expect(
      updatedTasks.every((update) => update.task_properties?.rest === 60),
    ).toBe(true);
  });

  test('keeps sets of the added exercise while adopting the group rest', async () => {
    await applyWorkoutGroupRest([
      task({ task_id: 1, task_group_block_id: 10 }),
      task({
        task_id: 2,
        task_group_block_id: null,
        task_properties: makeProps(2, 30),
      }),
    ]);

    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].task_id).toBe(2);
    expect(updatedTasks[0].task_properties?.rest).toBe(60);
    expect(updatedTasks[0].task_properties?.sets).toEqual([
      expect.objectContaining({ plan_value: 30, plan_rep: 10 }),
    ]);
  });

  test('does not call the API when the rest already matches', async () => {
    await applyWorkoutGroupRest([
      task({ task_id: 1, task_group_block_id: 10 }),
      task({ task_id: 2, task_group_block_id: 10 }),
    ]);

    expect(updatedTasks).toEqual([]);
  });

  test('falls back to the first member that set the rest', async () => {
    await applyWorkoutGroupRest([
      task({
        task_id: 1,
        task_group_block_id: 10,
        task_properties: null,
      }),
      task({
        task_id: 2,
        task_group_block_id: 10,
        task_properties: makeProps(2, 45),
      }),
    ]);

    expect(updatedTasks.map((update) => update.task_id)).toEqual([1]);
    expect(updatedTasks[0].task_properties?.rest).toBe(45);
  });
});

