import { ExerciseList, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useNavigate } from 'react-router';

const Page = () => {
  const navigate = useNavigate();
  const { token } = useTheme();

  const viewer = viewerModel.useViewer();
  const masterId = viewer.master!.master_id!;

  const exercises = exerciseModel.useExercises(masterId);

  const goToExercise = (ex: exerciseModel.Exercise) =>
    navigate({ pathname: `${ex.exercise_id}` });

  const createExercise = async () => {
    const ex = await Api.exercise.createExercise({
      master_id: masterId,
      exercise_name: 'Новое упражнение',
      description: '',
      link_ids: [],
    });
    goToExercise(ex);
  };

  return (
    <>
      <ExerciseList
        exercises={exercises}
        masterId={masterId}
        onSelect={goToExercise}
      />
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        style={{ bottom: token.paddingLG }}
        onClick={createExercise}
      />
    </>
  );
};

export default Page;
