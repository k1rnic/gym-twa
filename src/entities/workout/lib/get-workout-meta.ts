import { TaskAggregate, TaskGroupStatus, User } from '@/shared/api';
import { Workout } from '../model/types';

export const getWorkoutStatus = (status: TaskGroupStatus) => ({
  isActive: status === TaskGroupStatus.Running,
  isPlanned: status === TaskGroupStatus.Planned,
  isFinished: [
    TaskGroupStatus.Closed,
    TaskGroupStatus.Deleted,
    TaskGroupStatus.Finished,
  ].includes(status),
});

export const getWorkoutMeta = (
  user: User,
  workout: Workout,
  task?: TaskAggregate,
) => {
  const isArchive = (TaskGroupStatus.Finished,
  TaskGroupStatus.Closed,
  TaskGroupStatus.Deleted).includes(workout.status);

  const isCurrent = workout.status === TaskGroupStatus.Running;
  const isNew = workout.status === TaskGroupStatus.Planned;

  const isWorkoutOwner = workout.owner_id === user.user_id;
  const isTaskOwner = task?.owner_id === user.user_id;

  const workoutCreatedByStudent = workout.owner_id === workout.gymer_id;
  const workoutCreatedByTrainer = !workoutCreatedByStudent;

  return {
    isArchive,
    isCurrent,
    isNew,
    isWorkoutOwner,
    isTaskOwner,
    workoutCreatedByStudent,
    workoutCreatedByTrainer,
  };
};
