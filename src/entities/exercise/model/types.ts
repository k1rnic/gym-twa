import {
  Exercise as ExerciseApi,
  TaskAggregate,
  TaskPropertiesAggregate,
} from '@/shared/api-v2';

export type ExerciseInstance = TaskAggregate;
export type ExerciseInstanceProps = TaskPropertiesAggregate;
export type Exercise = ExerciseApi;
