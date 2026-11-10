import type { ExerciseSetHistoryItem } from '@/shared/api';
import { describe, expect, test } from 'bun:test';

import { parseHistoryDate, toHistoryEntries } from './to-history-entries';

const set = (
  weight: ExerciseSetHistoryItem['weight'],
  reps: ExerciseSetHistoryItem['reps'],
): ExerciseSetHistoryItem => ({ weight, reps });

describe('parseHistoryDate', () => {
  test('parses a date-only key as a local date', () => {
    const date = parseHistoryDate('2026-11-03');

    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(10);
    expect(date?.getDate()).toBe(3);
  });

  test('parses a date-time key', () => {
    const date = parseHistoryDate('2026-11-03T10:30:00Z');

    expect(date?.toISOString()).toBe('2026-11-03T10:30:00.000Z');
  });

  test('returns null for an invalid date-only key', () => {
    expect(parseHistoryDate('2026-02-31')).toBeNull();
  });

  test('returns null for an unparsable key', () => {
    expect(parseHistoryDate('not-a-date')).toBeNull();
  });
});

describe('toHistoryEntries', () => {
  test('sorts entries from newest to oldest', () => {
    const entries = toHistoryEntries({
      '2026-01-01': [set(10, 5)],
      '2026-03-01': [set(20, 3)],
      '2026-02-01': [set(30, 4)],
    });

    expect(entries.map((entry) => entry.key)).toEqual([
      '2026-03-01',
      '2026-02-01',
      '2026-01-01',
    ]);
  });

  test('keeps entries with unparsable keys at the end', () => {
    const entries = toHistoryEntries({
      unknown: [set(10, 5)],
      '2026-03-01': [set(20, 3)],
      '2026-02-01': [set(30, 4)],
    });

    expect(entries.map((entry) => entry.key)).toEqual([
      '2026-03-01',
      '2026-02-01',
      'unknown',
    ]);
  });

  test('skips entries without sets', () => {
    const entries = toHistoryEntries({
      '2026-03-01': [set(20, 3)],
      '2026-02-01': [],
    });

    expect(entries.map((entry) => entry.key)).toEqual(['2026-03-01']);
  });

  test('returns an empty list for a missing response', () => {
    expect(toHistoryEntries(undefined)).toEqual([]);
    expect(toHistoryEntries(null)).toEqual([]);
    expect(toHistoryEntries({})).toEqual([]);
  });

  test('does not mutate the source object', () => {
    const source = {
      '2026-01-01': [set(10, 5)],
      '2026-03-01': [set(20, 3)],
    };

    toHistoryEntries(source);

    expect(Object.keys(source)).toEqual(['2026-01-01', '2026-03-01']);
  });
});
