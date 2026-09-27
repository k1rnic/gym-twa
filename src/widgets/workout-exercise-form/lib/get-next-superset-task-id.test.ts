import type { workoutModel } from '@/entities/workout';
import { TaskGroupStatus, TaskStatus } from '@/shared/api';
import { describe, expect, test } from 'bun:test';
import { getNextSupersetTaskId } from './get-next-superset-task-id';

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
  ...partial,
});

const workout = (
  tasks: workoutModel.WorkoutExercise[],
): workoutModel.Workout => ({
  task_group_id: 1,
  title: null,
  master_id: 1,
  gymer_id: 2,
  status: TaskGroupStatus.Running,
  create_dttm: '',
  update_dttm: null,
  start_dttm: null,
  order_idx: 0,
  owner_id: 2,
  tasks,
});

describe('getNextSupersetTaskId', () => {
  test('returns the next member ordered by order_idx', () => {
    const first = task({ task_id: 2, task_group_block_id: 10, order_idx: 1 });
    const second = task({ task_id: 3, task_group_block_id: 10, order_idx: 0 });
    const third = task({ task_id: 4, task_group_block_id: 10, order_idx: 2 });

    expect(getNextSupersetTaskId(workout([first, second, third]), second)).toBe(
      2,
    );
    expect(getNextSupersetTaskId(workout([first, second, third]), first)).toBe(
      4,
    );
  });

  test('returns null for the last member of the group', () => {
    const first = task({ task_id: 2, task_group_block_id: 10, order_idx: 0 });
    const last = task({ task_id: 3, task_group_block_id: 10, order_idx: 1 });

    expect(getNextSupersetTaskId(workout([first, last]), last)).toBeNull();
  });

  test('returns null for a single-member group', () => {
    const member = task({ task_id: 2, task_group_block_id: 10 });

    expect(getNextSupersetTaskId(workout([member]), member)).toBeNull();
  });

  test('ignores members of other groups and solo exercises', () => {
    const member = task({ task_id: 2, task_group_block_id: 10, order_idx: 0 });
    const otherGroup = task({
      task_id: 5,
      task_group_block_id: 20,
      order_idx: 1,
    });
    const solo = task({ task_id: 6, order_idx: 2 });

    expect(
      getNextSupersetTaskId(workout([member, otherGroup, solo]), member),
    ).toBeNull();
  });

  test('returns null for an exercise outside a group', () => {
    const solo = task({ task_id: 7 });

    expect(getNextSupersetTaskId(workout([solo]), solo)).toBeNull();
  });

  test('returns null when the exercise is missing among the loaded tasks', () => {
    const member = task({ task_id: 2, task_group_block_id: 10, order_idx: 0 });
    const sibling = task({ task_id: 3, task_group_block_id: 10, order_idx: 1 });
    const stale = task({ task_id: 9, task_group_block_id: 10 });

    expect(getNextSupersetTaskId(workout([member, sibling]), stale)).toBeNull();
  });
});
