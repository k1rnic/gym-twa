import { ExerciseForm, ExerciseFormProps } from '@/entities/exercise';
import { Api, Task, TaskGroupStatus } from '@/shared/api';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useNavigate, useSearchParams } from 'react-router';
import { Route } from './+types/master-workout-ex-details';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.task
    .getTaskByTaskId(+params.exId)
    .then(({ exercise_desc, ...data }): ExerciseFormProps['values'] => ({
      ...data,
      exercise_id: exercise_desc.exercise_id,
      exercise_desc_id: exercise_desc.exercise_id,
    }));
};

const Page = ({ params, loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status') as TaskGroupStatus | null;

  const goBack = () => navigate('../');

  const handleSubmit = async (formData: Task) => {
    await Api.task.masterUpdateTask(
      +params.exId,
      { master_id: +params.mId },
      formData,
    );
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
        workoutId={+params.wId}
        values={loaderData}
        status={status}
        onSubmit={handleSubmit}
      />
    </PageDrawer>
  );
};

export default Page;
