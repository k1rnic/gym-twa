import { exerciseModel } from '@/entities/exercise';
import {
  getWorkoutStatus,
  useWorkoutPermissions,
  workoutModel,
} from '@/entities/workout';
import { useMemo } from 'react';

export const useExercisePermissions = (
  workout: workoutModel.Workout,
  exercise: exerciseModel.ExerciseInstance,
) => {
  const permissions = useWorkoutPermissions(workout, exercise);
  const workoutStatus = getWorkoutStatus(workout.status);

  const addTaskSet = useMemo(() => {
    if (workoutStatus.isFinished) return false;
    return (
      permissions.isGymmer ||
      (permissions.isTaskOwner && workoutStatus.isPlanned)
    );
  }, [workoutStatus, permissions.isTaskOwner, permissions.isGymmer]);

  const editSetValues =
    (permissions.isGymmer && workoutStatus.isActive) ||
    (permissions.isTaskOwner && workoutStatus.isPlanned);

  return {
    workoutStatus,
    permissions: { ...permissions, addTaskSet, editSetValues },
  };
};
