import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { Api, TaskGroupBlock } from '@/shared/api';
import { LinkBreakIcon } from '@phosphor-icons/react';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

/** Минимальное количество упражнений, при котором группа имеет смысл */
const minGroupSize = 2;

export const useDetachWorkoutGroupExerciseAction = (
  w: workoutModel.Workout,
  task: workoutModel.WorkoutExercise,
  group?: TaskGroupBlock | null,
  groupTasks: workoutModel.WorkoutExercise[] = [],
) => {
  const { t } = useTranslation();

  const { revalidate } = useRevalidator();
  const permissions = useWorkoutPermissions(w, task);

  const groupId = group?.task_group_block_id ?? null;
  const groupType = group?.group_type ?? null;

  const detachWorkoutGroupExercise = useCallback(async () => {
    if (groupId === null || groupType === null) return;

    const memberIds = groupTasks.length
      ? groupTasks.map((member) => member.task_id)
      : group?.task_ids ?? [];

    if (!memberIds.length) return;

    const remainingTaskIds = memberIds.filter(
      (taskId) => taskId !== task.task_id,
    );

    try {
      if (remainingTaskIds.length >= minGroupSize) {
        await Api.taskGroupBlock.updateTaskGroupBlock(groupId, {
          group_type: groupType,
          task_ids: remainingTaskIds,
        });
      } else {
        await Api.taskGroupBlock.deleteTaskGroupBlock(groupId);
      }

      revalidate();
    } catch (e) {
      console.error(e);
    }
  }, [
    groupId,
    groupType,
    group?.task_ids,
    groupTasks,
    task.task_id,
    revalidate,
  ]);

  return useMemo<Required<MenuProps>['items'][number]>(
    () =>
      groupId !== null && permissions.modifyWorkout
        ? {
            key: 'detach-group-exercise',
            label: t('training.detachFromGroup'),
            icon: <LinkBreakIcon />,
            onClick: detachWorkoutGroupExercise,
          }
        : null,
    [groupId, permissions.modifyWorkout, t, detachWorkoutGroupExercise],
  );
};
