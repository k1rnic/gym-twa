import { theme } from 'antd';
import { describe, expect, test } from 'bun:test';
import {
  normalizeThemeCode,
  resolveThemeAlgorithm,
  resolveThemeCode,
} from './theme';

describe('normalizeThemeCode', () => {
  test('trims and lowercases codes', () => {
    expect(normalizeThemeCode(' Dark ')).toBe('dark');
  });

  test('returns an empty string for missing codes', () => {
    expect(normalizeThemeCode(undefined)).toBe('');
    expect(normalizeThemeCode('  ')).toBe('');
  });
});

describe('resolveThemeCode', () => {
  const available = ['dark', 'light'];

  test('keeps a stored code that is available', () => {
    expect(resolveThemeCode('light', available, 'dark')).toBe('light');
  });

  test('normalizes the stored code', () => {
    expect(resolveThemeCode('DARK', available, 'light')).toBe('dark');
  });

  test('falls back when the stored theme no longer exists', () => {
    expect(resolveThemeCode('neon', available, 'light')).toBe('light');
  });

  test('falls back to the first available theme when default is unknown', () => {
    expect(resolveThemeCode('neon', available, 'unknown')).toBe('dark');
  });

  test('returns the fallback when nothing is available', () => {
    expect(resolveThemeCode('dark', [], 'dark')).toBe('dark');
  });
});

describe('resolveThemeAlgorithm', () => {
  test('resolves a single algorithm name', () => {
    expect(resolveThemeAlgorithm('dark')).toEqual([theme.darkAlgorithm]);
  });

  test('resolves a list of algorithm names', () => {
    expect(resolveThemeAlgorithm(['compact', 'dark'])).toEqual([
      theme.compactAlgorithm,
      theme.darkAlgorithm,
    ]);
  });

  test('returns nothing when algorithm is omitted', () => {
    expect(resolveThemeAlgorithm()).toEqual([]);
  });
});
