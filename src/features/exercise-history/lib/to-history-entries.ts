import type { ExerciseSetHistoryItem } from '@/shared/api';

export type ExerciseHistoryEntry = {
  key: string;
  date: Date | null;
  sets: ExerciseSetHistoryItem[];
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const parseHistoryDate = (key: string): Date | null => {
  const dateOnly = DATE_ONLY_PATTERN.exec(key);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
      ? date
      : null;
  }

  const date = new Date(key);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const toHistoryEntries = (
  history: Record<string, ExerciseSetHistoryItem[]> | null | undefined,
): ExerciseHistoryEntry[] =>
  Object.entries(history ?? {})
    .map(([key, sets]) => ({
      key,
      date: parseHistoryDate(key),
      sets: sets ?? [],
    }))
    .filter((entry) => entry.sets.length > 0)
    .sort((a, b) => {
      const aTime = a.date?.getTime();
      const bTime = b.date?.getTime();

      if (aTime !== undefined && bTime !== undefined) {
        return bTime - aTime;
      }

      if (aTime !== undefined) return -1;
      if (bTime !== undefined) return 1;

      return 0;
    });
