import { Api } from '@/shared/api';
import { useCallback, useEffect, useState } from 'react';

import {
  type ExerciseHistoryEntry,
  toHistoryEntries,
} from './to-history-entries';

type HistoryState = {
  entries: ExerciseHistoryEntry[];
  loading: boolean;
  error: boolean;
};

const INITIAL_STATE: HistoryState = {
  entries: [],
  loading: true,
  error: false,
};

export const useExerciseHistory = (
  exerciseId: number,
  gymerId: number,
  enabled = true,
) => {
  const [state, setState] = useState<HistoryState>(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    setState(INITIAL_STATE);

    Api.exercise
      .getExerciseSetsHistory({ exercise_id: exerciseId, gymer_id: gymerId })
      .then((history) => {
        if (cancelled) return;

        setState({
          entries: toHistoryEntries(history),
          loading: false,
          error: false,
        });
      })
      .catch((error) => {
        console.error('Failed to load exercise history', error);

        if (cancelled) return;

        setState({ entries: [], loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [exerciseId, gymerId, enabled, attempt]);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return { ...state, retry };
};
