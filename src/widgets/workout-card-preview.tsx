import { workoutModel } from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';
import { plural } from '@/shared/lib/plural';

import { Card, CardProps, Descriptions, Empty, Space, Typography } from 'antd';
import { DescriptionsItemType } from 'antd/lib/descriptions';
import { ReactNode, useMemo } from 'react';

export type WorkoutCardPreviewProps = {
  workout: workoutModel.Workout;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
} & Pick<CardProps, 'style' | 'onClick'>;

export const WorkoutCardPreview = (props: WorkoutCardPreviewProps) => {
  const { workout: w, extraBefore, extraAfter, ...cardProps } = props;

  const exerciseMeta = useMemo(
    () =>
      w.tasks?.map<DescriptionsItemType>((t) => ({
        key: t.task_id,
        label: t.exercise?.exercise_name,
        children: `${t.task_properties?.sets?.length ?? 0} ${plural(
          ['подход', 'подхода', 'подходов'],
          t.task_properties?.sets?.length ?? 0,
        )}`,
      })),
    [w.tasks],
  );

  return (
    <Card
      {...cardProps}
      title={w.title ?? 'Без названия'}
      styles={{ body: { padding: exerciseMeta?.length ? 0 : undefined } }}
      extra={
        <Space onClick={(e) => e.stopPropagation()}>
          {extraBefore}
          {extraAfter}
          <CopyWorkoutButton workoutId={w.task_group_id} />
        </Space>
      }
    >
      {exerciseMeta?.length ? (
        <Descriptions
          bordered
          column={1}
          items={exerciseMeta}
          styles={{
            label: { whiteSpace: 'normal', width: '100%' },
            content: { whiteSpace: 'nowrap' },
          }}
        />
      ) : (
        <Empty
          styles={{ image: { display: 'none' } }}
          description={
            <Typography.Text type="secondary">Нет упражнений</Typography.Text>
          }
        />
      )}
    </Card>
  );
};
