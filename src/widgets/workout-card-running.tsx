import {
  ExerciseCardBase,
  ExerciseCardList,
  ExerciseMeta,
  ExerciseMetaDivider,
  RestInfo,
  SetRepListField,
  SetsXRepsInfo,
  WeightInfo,
} from '@/entities/exercise';
import { WorkoutCardBase, WorkoutCardBaseProps } from '@/entities/workout';
import { CopyWorkoutButton } from '@/features/copy-workout';
import { TaskGroupWithTasks, TaskWithExercise } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { Flex } from '@/shared/ui/flex';
import { Space, Typography } from 'antd';
import { ReactNode } from 'react';

export type WorkoutCardRunningProps = {
  masterId?: number;
  workout: TaskGroupWithTasks;
  copyEnabled?: boolean;
  extraBefore?: ReactNode;
  extraAfter?: ReactNode;
  onExClick?: (w: TaskGroupWithTasks, ex: TaskWithExercise) => void;
} & Pick<WorkoutCardBaseProps, 'style'>;

export const WorkoutCardRunning = (props: WorkoutCardRunningProps) => {
  const { workout: w, masterId, style, onExClick } = props;

  return (
    <WorkoutCardBase
      key={w.task_group_id}
      title={formatDate(w.start_dttm ?? w.update_dttm)}
      style={style}
      workout={w}
      extra={
        <Space>
          {props.extraBefore}
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
              <Flex gap={8}>
                {ex.properties.sets ? <Typography>Подходы</Typography> : null}

                <SetRepListField
                  exercise={ex}
                  inputProps={{ readOnly: true }}
                />

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
              </Flex>
            }
          />
        )}
      />
    </WorkoutCardBase>
  );
};
