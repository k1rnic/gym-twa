import { exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { useMemo } from 'react';
import { Workout } from '../model/types';
import { getWorkoutStatus } from './get-workout-meta';

export const useWorkoutAccesses = (
  w: Workout,
  task?: exerciseModel.ExerciseInstance,
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

  const addTaskSet = useMemo(() => {
    if (status.isFinished) return false;
    return isGymmer || (isTaskOwner && status.isPlanned);
  }, [status, isTaskOwner, isGymmer]);

  return {
    modifyWorkout,
    deleteWorkout,
    runWorkout,
    finishWorkout,
    addTask,
    deleteTask,
    addTaskSet,
    isGymmer,
    isOwner,
    isTaskOwner,
  };
};
