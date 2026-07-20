import { ExerciseAvatar } from '@/entities/exercise';
import { UserAvatar } from '@/entities/user';
import { workoutModel } from '@/entities/workout';
import { useDeleteWorkoutExerciseAction } from '@/features/delete-exercise-instance';
import { Set } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { CardListItem } from '@/shared/ui/card-list';
import { Flex } from '@/shared/ui/flex';
import { Descriptions, MenuProps, Typography } from 'antd';
import { CardProps } from 'antd/lib';
import { DescriptionsItemType } from 'antd/lib/descriptions';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ExerciseCardProps = {
  id: Exclude<React.Key, bigint>;
  w: workoutModel.Workout;
  ex: workoutModel.WorkoutExercise;
  collapsed?: boolean;
  collapsible?: boolean;
  onClick?: () => void;
} & Pick<CardProps, 'style'>;

export const ExerciseCard = (props: ExerciseCardProps) => {
  const { t } = useTranslation();

  const { token } = useTheme();
  const { id, ex, w, collapsible, collapsed, onClick } = props;

  const [contentVisible, setContentVisible] = useState(!collapsed);

  const exSets = ex.task_properties?.sets ?? [];
  const hasSets = Boolean(ex.task_properties?.sets?.length);

  const deleteAction = useDeleteWorkoutExerciseAction(w, ex, 'delete');

  const actions = useMemo<MenuProps['items']>(
    () => [deleteAction],
    [deleteAction],
  );

  const hasFinishedExercises = useCallback(
    (set: Set) => set.fact_value !== null && set.fact_rep !== null,
    [],
  );

  const getExerciseDescriptions = useCallback(
    (ex: workoutModel.WorkoutExercise): DescriptionsItemType[] => [
      ...(ex.task_properties?.sets?.map((s, idx) => ({
        key: s.set_id,
        label: `${idx + 1}`,
        children: (
          <Flex vertical={false} width="100%">
            <Flex
              flex={1}
              align="flex-start"
              style={{ color: token.colorSuccess }}
              hidden={!hasFinishedExercises(s)}
            >
              {`${s.fact_value ?? 0} ${t('exercise.units.kg')} x ${
                s.fact_rep ?? 0
              } ${t('exercise.units.reps')}`}
            </Flex>

            <Flex
              flex={1}
              align={hasFinishedExercises(s) ? 'flex-end' : 'flex-start'}
            >{`${s.plan_value ?? 0} ${t('exercise.units.kg')} x ${
              s.plan_rep ?? 0
            } ${t('exercise.units.reps')}`}</Flex>
          </Flex>
        ),
      })) ?? []),
    ],
    [t, token.colorSuccess, hasFinishedExercises],
  );

  return (
    <CardListItem
      id={id}
      title={
        ex.exercise?.exercise_name ??
        t('common.notSelected')
      }
      avatar={<ExerciseAvatar exercise={ex.exercise!} size="large" />}
      actions={actions}
      footer={
        <Flex vertical={false} justify="space-between" align="center">
          {ex.owner && (
            <UserAvatar user={ex.owner} size="small" compact={false} />
          )}

          <Flex gap={token.paddingXXS} align="flex-end">
            <Typography hidden={contentVisible}>{`${exSets.length} ${t(
              'exercise.sets',
              { count: exSets.length },
            )}`}</Typography>

            <Typography>{`${t('exercise.playRest')}: ${
              ex.task_properties?.rest || 0
            } ${t('common.seconds')}`}</Typography>
          </Flex>
        </Flex>
      }
      collapsed
      collapsible={collapsible && hasSets}
      onToggle={setContentVisible}
      onClick={onClick}
    >
      {hasSets ? (
        <Flex px={token.paddingXXS} py={token.paddingSM}>
          <Descriptions column={1} items={getExerciseDescriptions(ex)} />
        </Flex>
      ) : null}
    </CardListItem>
  );
};
