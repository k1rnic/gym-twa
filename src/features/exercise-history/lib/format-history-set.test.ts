import type { TFunction } from 'i18next';
import { describe, expect, test } from 'bun:test';

import { formatHistorySet } from './format-history-set';

const translations: Record<string, string> = {
  'exercise.max': 'max',
  'exercise.units.kg': 'кг',
  'exercise.units.reps': 'раз',
};

const t = ((key: string) => translations[key] ?? key) as unknown as TFunction;

describe('formatHistorySet', () => {
  test('formats weight and reps', () => {
    expect(formatHistorySet({ weight: 80, reps: 10 }, t)).toBe(
      '80 кг × 10 раз',
    );
  });

  test('formats a max weight without units', () => {
    expect(formatHistorySet({ weight: 'max', reps: 8 }, t)).toBe(
      'max × 8 раз',
    );
  });

  test('shows a dash for missing reps', () => {
    expect(formatHistorySet({ weight: 82.5, reps: null }, t)).toBe(
      '82.5 кг × —',
    );
  });
});
