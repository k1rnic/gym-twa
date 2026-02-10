import { Set } from '@/shared/api';

export type SuggestionField = 'value' | 'rep';
export type SuggestionType = number | 'max';

export const getFieldSuggestions = (options: {
  mode: 'fact' | 'plan';
  field: SuggestionField;
  index: number;
  sets: Set[];
}): SuggestionType[] => {
  const { mode, field, index, sets } = options;

  if (!sets.length || index < 0 || index >= sets.length) {
    return [];
  }

  const isValueField = field === 'value';

  const getNumeric = (val: unknown): number | null => {
    return typeof val === 'number' ? val : null;
  };

  const current = sets[index];
  const prev = index > 0 ? sets[index - 1] : null;

  const planKey: keyof Set = isValueField ? 'plan_value' : 'plan_rep';
  // const factKey: keyof Set = isValueField ? 'fact_value' : 'fact_rep';

  // Если предыдущее значение равно 'max', предлагаем только 'max'
  // const prevForModeKey =
  //   mode === 'plan' ? planKey : mode === 'fact' ? factKey : planKey;
  // if (prev && prev[prevForModeKey] === ('max' as unknown)) {
  //   return ['max'];
  // }

  let base: number | null = null;

  if (mode === 'fact') {
    // Режим ученика:
    // x = запланированное значение (если пусто, то предыдущее)
    const currentPlan = getNumeric(current[planKey]);
    const prevPlan = getNumeric(prev?.[planKey]);

    base = currentPlan ?? prevPlan;
  } else {
    // Режим тренера:
    // x = предыдущее значение (если пусто, то max)
    const prevPlan = getNumeric(prev?.[planKey]);
    base = prevPlan;
  }

  if (base === null) {
    // Нет базового значения → только max
    return [];
  }

  const r1 = Math.max(base - 1, 0);
  const r2 = base;
  const r3 = base + 1;
  const r4 = (Math.floor(base / 10) + 1) * 10;

  const candidates: SuggestionType[] = [r1, r2, r3, r4];

  const unique: SuggestionType[] = [];
  for (const c of candidates) {
    if (!unique.includes(c)) {
      unique.push(c);
    }
  }

  return unique;
};
