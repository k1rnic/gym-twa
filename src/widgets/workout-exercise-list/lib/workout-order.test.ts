import type { workoutModel } from '@/entities/workout';
import { TaskGroupBlockType, TaskStatus } from '@/shared/api';
import { describe, expect, test } from 'bun:test';
import {
  flatten,
  getRowId,
  moveInsideGroup,
  moveRows,
  moveTasksAfterGroup,
  toRows,
  workoutRowId,
} from './workout-order';

const task = (
  partial: Partial<workoutModel.WorkoutExercise> &
    Pick<workoutModel.WorkoutExercise, 'task_id'>,
): workoutModel.WorkoutExercise => ({
  task_group_id: 1,
  exercise_id: null,
  status: TaskStatus.Planned,
  create_dttm: '',
  update_dttm: null,
  order_idx: 0,
  owner_id: null,
  ...partial,
});

describe('toRows', () => {
  test('sorts by order_idx and keeps solo exercises', () => {
    const rows = toRows([
      task({ task_id: 2, order_idx: 1 }),
      task({ task_id: 1, order_idx: 0 }),
    ]);

    expect(rows.map(getRowId)).toEqual([
      workoutRowId.exercise(1),
      workoutRowId.exercise(2),
    ]);
  });

  test('gathers group members at the first member even if they are not contiguous', () => {
    const rows = toRows(
      [
        task({ task_id: 1, order_idx: 0 }),
        task({ task_id: 2, order_idx: 1, task_group_block_id: 10 }),
        task({ task_id: 3, order_idx: 2 }),
        task({ task_id: 4, order_idx: 3, task_group_block_id: 10 }),
      ],
      [
        {
          task_group_block_id: 10,
          task_group_id: 1,
          group_type: TaskGroupBlockType.Superset,
          task_ids: [2, 4],
        },
      ],
    );

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ type: 'exercise', task: { task_id: 1 } });
    expect(rows[1]).toMatchObject({
      type: 'group',
      group: { task_group_block_id: 10 },
      tasks: [{ task_id: 2 }, { task_id: 4 }],
    });
    expect(rows[2]).toMatchObject({ type: 'exercise', task: { task_id: 3 } });
  });
});

describe('flatten', () => {
  test('roundtrips contiguous rows into dense order_idx', () => {
    const tasks = [
      task({ task_id: 1, order_idx: 0 }),
      task({ task_id: 2, order_idx: 1, task_group_block_id: 10 }),
      task({ task_id: 3, order_idx: 2, task_group_block_id: 10 }),
      task({ task_id: 4, order_idx: 3 }),
    ];
    const groups = [
      {
        task_group_block_id: 10,
        task_group_id: 1,
        group_type: TaskGroupBlockType.Triset,
        task_ids: [2, 3],
      },
    ];

    expect(flatten(toRows(tasks, groups)).map((item) => item.task_id)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(
      flatten(toRows(tasks, groups)).map((item) => item.order_idx),
    ).toEqual([0, 1, 2, 3]);
  });
});

describe('moveRows', () => {
  test('moves a group as a slice so the first inner task becomes the anchor', () => {
    const rows = toRows(
      [
        task({ task_id: 1, order_idx: 0 }),
        task({ task_id: 2, order_idx: 1, task_group_block_id: 10 }),
        task({ task_id: 3, order_idx: 2, task_group_block_id: 10 }),
        task({ task_id: 4, order_idx: 3 }),
      ],
      [
        {
          task_group_block_id: 10,
          task_group_id: 1,
          group_type: TaskGroupBlockType.Superset,
          task_ids: [2, 3],
        },
      ],
    );

    const moved = moveRows(rows, 1, 0);

    expect(moved.map((item) => item.task_id)).toEqual([2, 3, 1, 4]);
    expect(moved.map((item) => item.order_idx)).toEqual([0, 1, 2, 3]);
    expect(moved[0].task_group_block_id).toBe(10);
    expect(moved[1].task_group_block_id).toBe(10);
  });
});

describe('moveInsideGroup', () => {
  test('swaps only group members and leaves neighbors in place', () => {
    const rows = toRows(
      [
        task({ task_id: 1, order_idx: 0 }),
        task({ task_id: 2, order_idx: 1, task_group_block_id: 10 }),
        task({ task_id: 3, order_idx: 2, task_group_block_id: 10 }),
        task({ task_id: 4, order_idx: 3 }),
      ],
      [
        {
          task_group_block_id: 10,
          task_group_id: 1,
          group_type: TaskGroupBlockType.Superset,
          task_ids: [2, 3],
        },
      ],
    );

    const moved = moveInsideGroup(rows, 10, 0, 1);

    expect(moved.map((item) => item.task_id)).toEqual([1, 3, 2, 4]);
    expect(moved.map((item) => item.order_idx)).toEqual([0, 1, 2, 3]);
    expect(moved[0].task_id).toBe(1);
    expect(moved[3].task_id).toBe(4);
  });
});

describe('moveTasksAfterGroup', () => {
  test('keeps other rows in place while moving selected tasks into a group', () => {
    const moved = moveTasksAfterGroup(
      [
        task({ task_id: 1, order_idx: 0 }),
        task({ task_id: 2, order_idx: 1, task_group_block_id: 10 }),
        task({ task_id: 3, order_idx: 2 }),
        task({ task_id: 4, order_idx: 3, task_group_block_id: 10 }),
        task({ task_id: 5, order_idx: 4 }),
      ],
      10,
      [1, 3],
    );

    expect(moved.map((item) => item.task_id)).toEqual([2, 4, 1, 3, 5]);
    expect(moved.map((item) => item.order_idx)).toEqual([0, 1, 2, 3, 4]);
  });
});
