import {
  TaskAggregate,
  TaskGroupAggregate,
  TaskPropertiesAggregate,
} from '@/shared/api';

export type Workout = TaskGroupAggregate;
export type WorkoutExercise = TaskAggregate;
export type WorkoutExerciseProps = TaskPropertiesAggregate;
