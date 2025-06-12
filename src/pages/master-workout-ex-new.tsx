import { ExerciseForm } from '@/entities/exercise';
import { Api, Task } from '@/shared/api';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Route } from './+types/master-workout-ex-new';

const Page = ({ params }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const initialData = useMemo<Partial<Task>>(() => ({ properties: {} }), []);

  const goBack = () => navigate('../');

  const handleSubmit = async (formData: Task) => {
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
        workoutId={+params.wId}
        values={initialData}
        onSubmit={handleSubmit}
      />
    </PageDrawer>
  );
};

export default Page;
