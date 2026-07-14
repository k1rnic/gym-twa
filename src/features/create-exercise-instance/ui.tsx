import { viewerModel } from '@/entities/viewer';
import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { PlusIcon } from '@phosphor-icons/react';
import { Button } from 'antd';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type Props = {
  workout: workoutModel.Workout;
  style?: CSSProperties;
};

export const CreateWorkoutExerciseButton = ({ workout, style }: Props) => {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();
  const { t } = useTranslation();
  const permissions = useWorkoutPermissions(workout);

  const createWorkoutExercise = async () => {
    try {
      const instance = await Api.task.createTask({
        task_group_id: workout.task_group_id,
        owner_id: viewer.user_id,
      });
      navigate(`${instance?.task_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      block
      size="large"
      type="dashed"
      hidden={!permissions.addTask}
      onClick={createWorkoutExercise}
      icon={<PlusIcon />}
      style={style}
    >
      {t('training.createExercise')}
    </Button>
  );
};
