import { ExerciseAvatar } from '@/entities/exercise';
import { UserAvatar } from '@/entities/user';
import { workoutModel } from '@/entities/workout';
import { useCopyWorkoutAction } from '@/features/copy-workout';
import { useDeleteWorkoutAction } from '@/features/delete-workout';
import { CardListItem } from '@/shared/ui/card-list';
import { List, ListItem } from '@/shared/ui/list';

import { CardProps } from 'antd';
import { MenuProps } from 'antd/lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export type WorkoutCardProps = {
  id: Exclude<React.Key, bigint>;
  workout: workoutModel.Workout;
  collapsible?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
} & Pick<CardProps, 'style'>;

export const WorkoutCard = (props: WorkoutCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    id,
    workout: w,
    collapsible,
    collapsed = true,
    style,
    onClick,
  } = props;

  const taskCount = w.tasks?.length ?? 0;

  const copyAction = useCopyWorkoutAction(w, 'copy');
  const deleteAction = useDeleteWorkoutAction(w, 'delete');

  const actions = useMemo<MenuProps['items']>(
    () => [copyAction, deleteAction],
    [copyAction, deleteAction],
  );

  const goToWorkoutExercise = (ex: workoutModel.WorkoutExercise) => {
    navigate(`${w.task_group_id}/${ex.task_id}`);
  };

  return (
    <CardListItem
      id={id}
      title={w.title ?? t('training.titleFallback')}
      description={`${taskCount} ${t('training.exercises', {
        count: taskCount,
      })}`}
      actions={actions}
      collapsed={collapsed}
      collapsible={collapsible}
      style={style}
      footer={
        w.owner && <UserAvatar size="small" user={w.owner} compact={false} />
      }
      onClick={onClick}
    >
      <List
        items={w.tasks ?? []}
        itemKey="task_id"
        variant="simple"
        size="small"
        emptyText={t('training.emptyExercises')}
        renderItem={(task) => (
          <ListItem
            avatar={<ExerciseAvatar exercise={task.exercise!} size="default" />}
            header={task.exercise?.exercise_name}
            onClick={() => goToWorkoutExercise(task)}
          />
        )}
      />
    </CardListItem>
  );
};
