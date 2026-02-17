import { ExerciseList, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { FloatButton } from '@/shared/ui/float-button';
import { PlusOutlined } from '@ant-design/icons';
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
    <Flex height="100%" style={{ overflow: 'hidden', position: 'relative' }}>
      <ExerciseList
        exercises={exercises}
        masterId={masterId}
        onSelect={goToExercise}
      />
      <FloatButton icon={<PlusOutlined />} onClick={createExercise} />
    </Flex>
  );
};

export default Page;
