import { workoutModel } from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';
import { Flex } from '@/shared/ui/flex';

import { Card, CardProps, Empty, List, Space, Typography } from 'antd';
import { ReactNode } from 'react';

export type WorkoutCardPreviewProps = {
  workout: workoutModel.Workout;
  titleExtraBefore?: ReactNode;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
} & Pick<CardProps, 'style' | 'onClick'>;

export const WorkoutCardPreview = (props: WorkoutCardPreviewProps) => {
  const {
    workout: w,
    extraBefore,
    extraAfter,
    titleExtraBefore,
    ...cardProps
  } = props;

  return (
    <Card
      {...cardProps}
      title={
        <Flex
          vertical={false}
          align="center"
          gap={8}
          style={{ whiteSpace: 'break-spaces' }}
        >
          {titleExtraBefore}
          <Typography.Text ellipsis>
            {w.title ?? 'Без названия'}
          </Typography.Text>
        </Flex>
      }
      styles={{ body: { padding: w.tasks?.length ? 0 : undefined } }}
      extra={
        <Space onClick={(e) => e.stopPropagation()}>
          {extraBefore}
          {extraAfter}
          <CopyWorkoutButton workoutId={w.task_group_id} />
        </Space>
      }
    >
      {w.tasks?.length ? (
        <List
          dataSource={w.tasks}
          renderItem={(item) => (
            <List.Item style={{ cursor: 'pointer' }}>
              <Flex vertical={false} width="100%">
                <List.Item.Meta
                  title={
                    <Typography.Text type="secondary">
                      {item.exercise?.exercise_name}
                    </Typography.Text>
                  }
                />
              </Flex>
            </List.Item>
          )}
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
