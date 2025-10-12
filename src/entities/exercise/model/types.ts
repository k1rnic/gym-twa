import {
  Exercise as ExerciseApi,
  TaskAggregate,
  TaskPropertiesAggregate,
} from '@/shared/api';

export type ExerciseInstance = TaskAggregate;
export type ExerciseInstanceProps = TaskPropertiesAggregate;
export type Exercise = ExerciseApi;
