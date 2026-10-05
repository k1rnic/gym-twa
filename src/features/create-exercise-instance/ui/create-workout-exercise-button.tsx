import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { useToggle } from '@/shared/lib/hooks';
import { PlusIcon } from '@phosphor-icons/react';
import { Button } from 'antd';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

import { ExercisePickerDrawer } from './exercise-picker-drawer';

type Props = {
  workout: workoutModel.Workout;
  style?: CSSProperties;
};

export const CreateWorkoutExerciseButton = ({ workout, style }: Props) => {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const permissions = useWorkoutPermissions(workout);
  const [open, toggle] = useToggle();

  return (
    <>
      <Button
        block
        hidden={!permissions.addTask}
        onClick={toggle}
        icon={<PlusIcon />}
        style={style}
      >
        {t('training.createExercise')}
      </Button>

      <ExercisePickerDrawer
        open={open}
        taskGroupId={workout.task_group_id}
        onClose={toggle}
        onCreated={revalidate}
      />
    </>
  );
};
