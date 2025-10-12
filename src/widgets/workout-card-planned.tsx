import {
  ExerciseCardBase,
  ExerciseCardList,
  ExerciseMeta,
  ExerciseMetaDivider,
  exerciseModel,
  RestInfo,
  WeightInfo,
} from '@/entities/exercise';
import {
  WorkoutCardBase,
  WorkoutCardBaseProps,
  workoutModel,
} from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { ReactNode } from 'react';
import { Link } from 'react-router';

export type WorkoutCardPlannedProps = {
  masterId?: number;
  workout: workoutModel.Workout;
  createEnabled?: boolean;
  copyEnabled?: boolean;
  onExClick?: (
    w: workoutModel.Workout,
    ex: exerciseModel.ExerciseInstance,
  ) => void;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
} & Pick<WorkoutCardBaseProps, 'title' | 'style'>;

export const WorkoutCardPlanned = (props: WorkoutCardPlannedProps) => {
  const {
    workout: w,
    masterId,
    title,
    style,
    copyEnabled = false,
    onExClick,
  } = props;

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
          {copyEnabled && masterId && (
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
        exercises={w.tasks ?? []}
        renderItem={(ex) => (
          <ExerciseCardBase
            ex={ex}
            onTitleClick={onExClick ? () => onExClick(w, ex) : undefined}
            description={
              <ExerciseMeta>
                <WeightInfo
                  min_weight={ex.task_properties?.min_weight}
                  max_weight={ex.task_properties?.max_weight}
                />
                <ExerciseMetaDivider />
                {/* FIXME: fix dependencies */}
                {/* <SetsXRepsInfo
                  sets={ex.task_properties?.sets}
                  repeats={ex.task_properties?.repeats}
                /> */}
                <ExerciseMetaDivider />
                <RestInfo rest={ex.task_properties?.rest} />
              </ExerciseMeta>
            }
          />
        )}
      />
    </WorkoutCardBase>
  );
};
