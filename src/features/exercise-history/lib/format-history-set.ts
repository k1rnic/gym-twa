import type { ExerciseSetHistoryItem } from '@/shared/api';
import type { TFunction } from 'i18next';

export const formatHistorySet = (
  set: ExerciseSetHistoryItem,
  t: TFunction,
): string => {
  const weight =
    set.weight === 'max'
      ? t('exercise.max')
      : `${set.weight} ${t('exercise.units.kg')}`;

  const reps =
    set.reps === null ? '—' : `${set.reps} ${t('exercise.units.reps')}`;

  return `${weight} × ${reps}`;
};
