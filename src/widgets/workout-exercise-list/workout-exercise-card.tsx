import { ExerciseAvatar, exerciseModel } from '@/entities/exercise';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { workoutModel } from '@/entities/workout';
import { useDeleteExerciseInstanceAction } from '@/features/delete-exercise-instance';
import { Set } from '@/shared/api';
import { plural } from '@/shared/lib/plural';
import { useTheme } from '@/shared/lib/theme';
import { CardListItem } from '@/shared/ui/card-list';
import { Flex } from '@/shared/ui/flex';
import { Descriptions, MenuProps, Typography } from 'antd';
import { CardProps } from 'antd/lib';
import { DescriptionsItemType } from 'antd/lib/descriptions';
import { useCallback, useMemo, useState } from 'react';

type ExerciseCardProps = {
  id: Exclude<React.Key, bigint>;
  w: workoutModel.Workout;
  ex: exerciseModel.ExerciseInstance;
  collapsed?: boolean;
  collapsible?: boolean;
} & Pick<CardProps, 'style' | 'onClick'>;

export const ExerciseCard = (props: ExerciseCardProps) => {
  const { token } = useTheme();
  const { id, ex, w, collapsible, collapsed, onClick } = props;

  const [contentVisible, setContentVisible] = useState(!collapsed);

  const exSets = ex.task_properties?.sets ?? [];
  const hasSets = Boolean(ex.task_properties?.sets?.length);

  const deleteAction = useDeleteExerciseInstanceAction(w, ex, 'delete');

  const actions = useMemo<MenuProps['items']>(
    () => [deleteAction],
    [deleteAction],
  );

  const hasFinishedExercises = useCallback(
    (set: Set) => set.fact_value !== null && set.fact_rep !== null,
    [],
  );

  const getExerciseDescriptions = useCallback(
    (ex: exerciseModel.ExerciseInstance): DescriptionsItemType[] => [
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
              {`${s.fact_value ?? 0} кг x ${s.fact_rep ?? 0} раз`}
            </Flex>

            <Flex flex={1} align="flex-end">{`${s.plan_value ?? 0} кг x ${
              s.plan_rep ?? 0
            } раз`}</Flex>
          </Flex>
        ),
      })) ?? []),
    ],
    [token.colorSuccess, hasFinishedExercises],
  );

  return (
    <CardListItem
      id={id}
      title={ex.exercise?.exercise_name ?? 'Не выбрано'}
      avatar={<ExerciseAvatar exercise={ex.exercise!} size="large" />}
      actions={actions}
      footer={
        <Flex vertical={false} justify="space-between">
          <Flex gap={token.paddingXXS}>
            <Typography>{`Отдых: ${
              ex.task_properties?.rest || 0
            } сек`}</Typography>
            {ex.owner && (
              <Flex gap={8} vertical={false}>
                <UserAvatar user={ex.owner} size="small" />
                <Typography.Text>
                  {ex.owner.username || formatUserFullName(ex.owner)}
                </Typography.Text>
              </Flex>
            )}
          </Flex>
          <Typography hidden={contentVisible}>{`${exSets.length} ${plural(
            ['подход', 'подхода', 'подходов'],
            exSets.length,
          )}`}</Typography>
        </Flex>
      }
      collapsed
      collapsible={collapsible && hasSets}
      onToggle={setContentVisible}
      onClick={onClick}
    >
      {hasSets ? (
        <Descriptions column={1} items={getExerciseDescriptions(ex)} />
      ) : null}
    </CardListItem>
  );
};
