import { ExerciseForm, exerciseModel } from '@/entities/exercise';
import { Api } from '@/shared/api-v2';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Route } from './+types/master-workout-ex-new';

const Page = ({ params }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const initialData = useMemo<Partial<exerciseModel.ExerciseInstance>>(
    () => ({ task_group_id: +params.wId }),
    [params.wId],
  );

  const goBack = () => navigate('../');

  const handleSubmit = async (formData: exerciseModel.ExerciseInstance) => {
    await Api.task.createTask(formData);
    goBack();
  };

  return (
    <PageDrawer
      open
      title="Новое упражнение"
      placement="bottom"
      height="auto"
      onClose={goBack}
    >
      <ExerciseForm
        masterId={+params.mId}
        values={initialData}
        onSubmit={handleSubmit}
      />
    </PageDrawer>
  );
};

export default Page;
