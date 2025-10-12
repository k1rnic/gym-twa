import { ExerciseForm, exerciseModel } from '@/entities/exercise';
import { Api, TaskGroupStatus, UpdateTask } from '@/shared/api';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useNavigate, useSearchParams } from 'react-router';
import { Route } from './+types/master-workout-ex-details';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.task
    .getTasksWithExerciseByGroup(+params.exId)
    .then((data) => data.find((item) => item.task_id === +params.exId)!);
};

const Page = ({ params, loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status') as TaskGroupStatus | null;

  const goBack = () => navigate('../');

  const handleSubmit = async (formData: exerciseModel.ExerciseInstance) => {
    await Api.task.updateTask(formData as UpdateTask);
    goBack();
  };

  return (
    <PageDrawer
      open
      title="Детали упражнения"
      placement="bottom"
      height="auto"
      onClose={goBack}
    >
      <ExerciseForm
        masterId={+params.mId}
        values={loaderData}
        status={status}
        onSubmit={handleSubmit}
      />
    </PageDrawer>
  );
};

export default Page;
