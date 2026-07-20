import { ExerciseList, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { FloatButton } from '@/shared/ui/float-button';
import { PageLayout } from '@/shared/ui/page-layout';
import { PlusIcon } from '@phosphor-icons/react';
import { RouteHandle, useNavigate } from 'react-router';
import { Route } from './+types/exercises';

export const handle: RouteHandle = { root: true };

export const clientLoader = async () => {
  const viewer = viewerModel.getViewerState();

  if (!Number(viewer?.master?.master_id)) return [];

  return await Api.exercise
    .getListOfExercise(viewer!.master!.master_id!)
    .catch(() => []);
};

const Page = ({ loaderData: exercises }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const viewer = viewerModel.useViewer();
  const masterId = viewer.master!.master_id!;

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
    <PageLayout contentStyle={{ paddingBottom: 0 }}>
      <Flex height="100%" style={{ overflow: 'hidden', position: 'relative' }}>
        <ExerciseList
          exercises={exercises}
          masterId={masterId}
          onSelect={goToExercise}
        />
        <FloatButton icon={<PlusIcon />} onClick={createExercise} />
      </Flex>
    </PageLayout>
  );
};

export default Page;
