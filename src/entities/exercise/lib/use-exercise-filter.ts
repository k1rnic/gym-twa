import { useMemo } from 'react';
import { Exercise } from '../model/types';

export function useExerciseFilter(
  exercises: Exercise[],
  masterId: number,
  query: string,
) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises
      .filter((ex) => ex.exercise_name?.toLowerCase().includes(q))
      .sort((a, b) =>
        (a.exercise_name || '').localeCompare(b.exercise_name || ''),
      );
  }, [exercises, query]);

  const grouped = useMemo(() => {
    const yours = filtered.filter((ex) => ex.master_id === masterId);
    const basic = filtered.filter((ex) => ex.master_id !== masterId);
    return { yours, basic };
  }, [filtered, masterId]);

  return grouped;
}
