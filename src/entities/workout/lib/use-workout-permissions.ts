import { viewerModel } from '@/entities/viewer';
import { workoutModel } from '@/entities/workout';
import { useMemo } from 'react';
import { Workout } from '../model/types';
import { getWorkoutStatus } from './get-workout-meta';

export const useWorkoutPermissions = (
  w: Workout,
  task?: workoutModel.WorkoutExercise,
) => {
  const { gymer, user_id } = viewerModel.useViewer();

  const status = useMemo(() => getWorkoutStatus(w.status), [w.status]);

  const isGymmer = w.gymer_id === gymer?.gymer_id;
  const isOwner = w.owner_id === user_id;
  const isTaskOwner = task?.owner_id === user_id;

  const modifyWorkout = isOwner && status.isPlanned;

  const runWorkout = isGymmer && status.isPlanned;
  const finishWorkout = isGymmer && status.isActive;

  const deleteWorkout = useMemo(() => {
    if (status.isFinished) return false;
    return isGymmer || (isOwner && status.isPlanned);
  }, [status, isOwner, isGymmer]);

  const addTask = isOwner && !status.isFinished;

  const deleteTask =
    (isGymmer && !status.isFinished) || (isTaskOwner && status.isPlanned);

  return {
    modifyWorkout,
    deleteWorkout,
    runWorkout,
    finishWorkout,
    addTask,
    deleteTask,
    isGymmer,
    isOwner,
    isTaskOwner,
  };
};
