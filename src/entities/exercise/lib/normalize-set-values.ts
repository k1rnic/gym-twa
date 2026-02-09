import {
  SetUpdate,
  TaskPropertiesAggregateUpdate,
  UpdateTask,
} from '@/shared/api';
import { ExerciseInstance } from '../model/types';

const mapValue = (value: unknown): number | 'max' | null => {
  if (value === 'max') {
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (value === null) {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

export const normalizeSetValues = (instance: ExerciseInstance): UpdateTask => {
  const taskProps = instance.task_properties;

  const sets = (taskProps?.sets?.map((set) => ({
    set_id: set.set_id,
    fact_value: mapValue(set.fact_value),
    fact_rep: mapValue(set.fact_rep),
    plan_value: mapValue(set.plan_value),
    plan_rep: mapValue(set.plan_rep),
  })) ?? []) as SetUpdate[];

  const taskProperties: TaskPropertiesAggregateUpdate | null = taskProps
    ? {
        max_weight: taskProps.max_weight ?? null,
        min_weight: taskProps.min_weight ?? null,
        rest: taskProps.rest ?? null,
        sets,
      }
    : null;

  return {
    task_id: instance.task_id,
    exercise_id: instance.exercise_id!,
    status: instance.status ?? null,
    task_properties: taskProperties,
  };
};
