import { ExerciseAvatar, exerciseModel } from '@/entities/exercise';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { workoutModel } from '@/entities/workout';
import { useCopyWorkoutAction } from '@/features/copy-workout';
import { useDeleteWorkoutAction } from '@/features/delete-workout';
import { plural } from '@/shared/lib/plural';
import { CardListItem } from '@/shared/ui/card-list';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';

import { CardProps, Typography } from 'antd';
import { MenuProps } from 'antd/lib';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';

export type WorkoutCardProps = {
  id: Exclude<React.Key, bigint>;
  workout: workoutModel.Workout;
  collapsible?: boolean;
  collapsed?: boolean;
} & Pick<CardProps, 'style' | 'onClick'>;

export const WorkoutCard = (props: WorkoutCardProps) => {
  const navigate = useNavigate();

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

  const goToExerciseInstance = (ex: exerciseModel.ExerciseInstance) => {
    navigate(`${w.task_group_id}/${ex.task_id}`);
  };

  return (
    <CardListItem
      id={id}
      title={w.title ?? 'Без названия'}
      description={`${taskCount} ${plural(
        ['упражнение', 'упражнения', 'упражнений'],
        taskCount,
      )}`}
      actions={actions}
      collapsed={collapsed}
      collapsible={collapsible}
      style={style}
      footer={
        w.owner && (
          <Flex gap={8} vertical={false}>
            <UserAvatar size="small" user={w.owner} />
            <Typography.Text>
              {w.owner.username || formatUserFullName(w.owner)}
            </Typography.Text>
          </Flex>
        )
      }
      onClick={onClick}
    >
      <List
        items={w.tasks ?? []}
        itemKey="task_id"
        variant="simple"
        size="small"
        emptyText="Упражнения пока не добавлены"
        renderItem={(task) => (
          <ListItem
            avatar={<ExerciseAvatar exercise={task.exercise!} size="large" />}
            header={task.exercise?.exercise_name}
            onClick={() => goToExerciseInstance(task)}
          />
        )}
      />
    </CardListItem>
  );
};
