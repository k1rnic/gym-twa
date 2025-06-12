import {
  ExerciseCardBase,
  ExerciseCardList,
  ExerciseMeta,
  ExerciseMetaDivider,
  RestInfo,
  SetsXRepsInfo,
  WeightInfo,
} from '@/entities/exercise';
import { WorkoutCardBase, WorkoutCardBaseProps } from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';
import { TaskGroupWithTasks, TaskWithExercise } from '@/shared/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { ReactNode } from 'react';
import { Link } from 'react-router';

export type WorkoutCardPlannedProps = {
  masterId?: number;
  workout: TaskGroupWithTasks;
  createEnabled?: boolean;
  copyEnabled?: boolean;
  onExClick?: (w: TaskGroupWithTasks, ex: TaskWithExercise) => void;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
} & Pick<WorkoutCardBaseProps, 'title' | 'style'>;

export const WorkoutCardPlanned = (props: WorkoutCardPlannedProps) => {
  const { workout: w, masterId, title, style, onExClick } = props;

  return (
    <WorkoutCardBase
      key={w.task_group_id}
      title={title}
      style={style}
      workout={w}
      extra={
        <Space>
          {props.extraBefore}
          {props.createEnabled && (
            <Link to={`${w.task_group_id}/new`}>
              <Button type="primary" icon={<PlusOutlined />} />
            </Link>
          )}
          {props.copyEnabled && masterId && (
            <CopyWorkoutButton
              workoutId={w.task_group_id}
              masterId={masterId}
            />
          )}
          {props.extraAfter}
        </Space>
      }
    >
      <ExerciseCardList
        exercises={w.task}
        renderItem={(ex) => (
          <ExerciseCardBase
            ex={ex}
            onTitleClick={onExClick ? () => onExClick(w, ex) : undefined}
            description={
              <ExerciseMeta>
                <WeightInfo
                  min_weight={ex.properties.min_weight}
                  max_weight={ex.properties.max_weight}
                />
                <ExerciseMetaDivider />
                <SetsXRepsInfo
                  sets={ex.properties.sets}
                  repeats={ex.properties.repeats}
                />
                <ExerciseMetaDivider />
                <RestInfo rest={ex.properties.rest} />
              </ExerciseMeta>
            }
          />
        )}
      />
    </WorkoutCardBase>
  );
};
