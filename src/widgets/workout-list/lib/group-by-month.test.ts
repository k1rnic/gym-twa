import type { workoutModel } from '@/entities/workout';
import { TaskGroupStatus } from '@/shared/api';
import { describe, expect, test } from 'bun:test';
import {
  groupWorkoutsByMonth,
  resolveWorkoutDate,
  UNKNOWN_MONTH_KEY,
} from './group-by-month';

const workout = (
  partial: Partial<workoutModel.Workout> &
    Pick<workoutModel.Workout, 'task_group_id'>,
): workoutModel.Workout => ({
  title: null,
  master_id: 1,
  gymer_id: 2,
  status: TaskGroupStatus.Finished,
  // Mid-month at midday UTC: the local calendar month is the same in every
  // real timezone, so grouping stays deterministic regardless of the runner.
  create_dttm: '2026-01-15T12:00:00Z',
  update_dttm: null,
  start_dttm: null,
  order_idx: null,
  owner_id: null,
  ...partial,
});

describe('resolveWorkoutDate', () => {
  test('prefers update_dttm over create_dttm', () => {
    const date = resolveWorkoutDate(
      workout({
        task_group_id: 1,
        create_dttm: '2026-01-01T10:00:00Z',
        update_dttm: '2026-03-04T12:30:00Z',
      }),
    );

    expect(date?.toISOString()).toBe('2026-03-04T12:30:00.000Z');
  });

  test('falls back to create_dttm when update_dttm is missing', () => {
    const date = resolveWorkoutDate(
      workout({ task_group_id: 1, create_dttm: '2026-05-06T07:00:00Z' }),
    );

    expect(date?.toISOString()).toBe('2026-05-06T07:00:00.000Z');
  });

  test('returns null for an unparsable date', () => {
    expect(
      resolveWorkoutDate(workout({ task_group_id: 1, create_dttm: 'nope' })),
    ).toBeNull();
  });
});

describe('groupWorkoutsByMonth', () => {
  test('groups by month and year in reverse chronological order', () => {
    const groups = groupWorkoutsByMonth([
      workout({ task_group_id: 1, update_dttm: '2026-02-15T12:00:00Z' }),
      workout({ task_group_id: 2, update_dttm: '2025-12-15T12:00:00Z' }),
      workout({ task_group_id: 3, update_dttm: '2026-01-15T12:00:00Z' }),
      workout({ task_group_id: 4, update_dttm: '2026-02-05T12:00:00Z' }),
    ]);

    expect(groups.map((group) => group.key)).toEqual([
      '2026-02',
      '2026-01',
      '2025-12',
    ]);
  });

  test('sorts workouts inside a month from the most recent one', () => {
    const [group] = groupWorkoutsByMonth([
      workout({ task_group_id: 1, update_dttm: '2026-02-05T12:00:00Z' }),
      workout({ task_group_id: 2, update_dttm: '2026-02-20T12:00:00Z' }),
      workout({ task_group_id: 3, update_dttm: '2026-02-11T12:00:00Z' }),
    ]);

    expect(group.workouts.map((w) => w.task_group_id)).toEqual([2, 3, 1]);
  });

  test('groups by the resolved date, not by create_dttm', () => {
    const [group] = groupWorkoutsByMonth([
      workout({
        task_group_id: 1,
        create_dttm: '2026-01-15T12:00:00Z',
        update_dttm: '2026-04-15T12:00:00Z',
      }),
    ]);

    expect(group.key).toBe('2026-04');
  });

  test('keeps workouts without a parsable date in a trailing group', () => {
    const groups = groupWorkoutsByMonth([
      workout({ task_group_id: 1, create_dttm: 'bad', update_dttm: null }),
      workout({ task_group_id: 2, update_dttm: '2026-01-15T12:00:00Z' }),
    ]);

    expect(groups.map((group) => group.key)).toEqual([
      '2026-01',
      UNKNOWN_MONTH_KEY,
    ]);
    expect(groups[1].date).toBeNull();
    expect(groups[1].workouts.map((w) => w.task_group_id)).toEqual([1]);
  });

  test('returns nothing for an empty list', () => {
    expect(groupWorkoutsByMonth([])).toEqual([]);
  });

  test('does not mutate the source array', () => {
    const workouts = [
      workout({ task_group_id: 1, update_dttm: '2026-02-15T12:00:00Z' }),
      workout({ task_group_id: 2, update_dttm: '2026-01-15T12:00:00Z' }),
    ];

    groupWorkoutsByMonth(workouts);

    expect(workouts.map((w) => w.task_group_id)).toEqual([1, 2]);
  });
});
