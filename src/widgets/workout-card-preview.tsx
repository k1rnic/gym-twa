import { ExerciseAvatar } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';
import { Flex } from '@/shared/ui/flex';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import { Card, CardProps, Empty, List, Space, Typography } from 'antd';
import { ReactNode, useEffect, useRef, useState } from 'react';

export type WorkoutCardPreviewProps = {
  workout: workoutModel.Workout;
  titleExtraBefore?: ReactNode;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
  collapsible?: boolean;
} & Pick<CardProps, 'style' | 'onClick'>;

export const WorkoutCardPreview = (props: WorkoutCardPreviewProps) => {
  const {
    workout: w,
    extraBefore,
    extraAfter,
    titleExtraBefore,
    collapsible,
    ...cardProps
  } = props;

  const listRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState(collapsible);

  const toggleClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    setCollapsed(collapsible);
  }, [collapsible]);

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
          {collapsible &&
            (collapsed ? (
              <RightOutlined onClick={toggleClicked} />
            ) : (
              <DownOutlined onClick={toggleClicked} />
            ))}
        </Space>
      }
    >
      {w.tasks?.length ? (
        <List
          ref={listRef}
          style={{
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.2s ease',
            maxHeight: collapsed ? 0 : listRef.current?.scrollHeight,
            opacity: collapsed ? 0 : 1,
          }}
          dataSource={w.tasks}
          renderItem={(item) => (
            <List.Item style={{ cursor: 'pointer' }}>
              <Flex vertical={false} width="100%">
                <List.Item.Meta
                  avatar={<ExerciseAvatar exercise={item.exercise!} />}
                  description={item.exercise?.exercise_name}
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
