import {
  ExerciseCardBase,
  ExerciseCardList,
  ExerciseMeta,
  ExerciseMetaDivider,
  RestInfo,
  WeightInfo,
} from '@/entities/exercise';
import {
  WorkoutCardBase,
  WorkoutCardBaseProps,
  workoutModel,
} from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';
import { TaskAggregate } from '@/shared/api-v2';
import { formatDate } from '@/shared/lib/date';
import { Flex } from '@/shared/ui/flex';
import { Space, Typography } from 'antd';
import { ReactNode } from 'react';

export type WorkoutCardRunningProps = {
  masterId?: number;
  workout: workoutModel.Workout;
  copyEnabled?: boolean;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
  onExClick?: (
    w: workoutModel.Workout,
    // FIXME: fix dependencies
    ex: TaskAggregate,
  ) => void;
} & Pick<WorkoutCardBaseProps, 'style'>;

export const WorkoutCardRunning = (props: WorkoutCardRunningProps) => {
  const { workout: w, masterId, style, copyEnabled = false, onExClick } = props;

  return (
    <WorkoutCardBase
      key={w.task_group_id}
      title={formatDate(w.start_dttm ?? w.update_dttm)}
      style={style}
      workout={w}
      extra={
        <Space>
          {props.extraBefore}
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
              <Flex gap={8}>
                {ex.task_properties?.sets ? (
                  <Typography>Подходы</Typography>
                ) : null}

                {/* FIXME: fix dependencies */}
                {/* <SetRepListField
                  exercise={ex}
                  inputProps={{ readOnly: true }}
                /> */}

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
              </Flex>
            }
          />
        )}
      />
    </WorkoutCardBase>
  );
};
