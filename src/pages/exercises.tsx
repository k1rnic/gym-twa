import { ExerciseList, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router';

const Page = () => {
  const navigate = useNavigate();

  const viewer = viewerModel.useViewer();
  const masterId = viewer.master!.master_id!;

  const exercises = exerciseModel.useExercises(masterId);

  const goToExercise = (ex: exerciseModel.Exercise) =>
    navigate({ pathname: `${ex.exercise_id}` });

  const createExercise = async () => {
    const ex = await Api.exercise.createExercise({
      master_id: masterId,
      exercise_name: '',
      description: '',
      link_ids: [],
    });
    goToExercise(ex);
  };

  return (
    <ExerciseList
      exercises={exercises}
      masterId={masterId}
      extra={
        <Button
          block
          type="primary"
          size="middle"
          icon={<PlusOutlined />}
          onClick={createExercise}
        >
          Добавить упражнение
        </Button>
      }
      onSelect={goToExercise}
    />
  );
};

export default Page;
