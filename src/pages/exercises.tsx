import { ExerciseList, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { useNavigate } from 'react-router';

const Page = () => {
  const navigate = useNavigate();

  const viewer = viewerModel.useViewer();
  const masterId = viewer.master!.master_id!;

  const exercises = exerciseModel.useExercises(masterId);

  const goToExercise = (ex: exerciseModel.Exercise) =>
    navigate({ pathname: `${ex.exercise_id}` });

  return (
    <ExerciseList
      exercises={exercises}
      masterId={masterId}
      onSelect={goToExercise}
    />
  );
};

export default Page;
