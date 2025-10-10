import { workoutModel } from '@/entities/workout';
import { Card } from 'antd';
import { CardProps } from 'antd/lib';
import { PropsWithChildren } from 'react';

export type WorkoutCardBaseProps = {
  workout: workoutModel.Workout;
} & Pick<CardProps, 'title' | 'extra' | 'style'>;

export const WorkoutCardBase = ({
  title,
  extra,
  style,
  children,
}: PropsWithChildren<WorkoutCardBaseProps>) => {
  return (
    <Card
      title={title}
      style={style}
      styles={{ body: { padding: 0 } }}
      extra={extra}
    >
      {children}
    </Card>
  );
};
