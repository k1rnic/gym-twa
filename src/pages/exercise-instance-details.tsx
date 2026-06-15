import { Api } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { DeleteButton } from '@/shared/ui/delete-button';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExerciseForm } from '@/widgets/workout-exercise-form';
import { normalizeSetValues } from '@/widgets/workout-exercise-form/lib/normalize-set-values';
import { Empty } from 'antd';
import { useState } from 'react';
import { Route } from './+types/exercise-instance-details';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const workout = await Api.taskGroup.taskGroupById(+params.wId);
  const exercise = await Api.task.getTaskByTaskId(+params.exId);

  return { workout, exercise };
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  const goBack = useNavigateBack();

  const { workout, exercise } = loaderData;

  const [formValues, setFormValues] = useState(exercise);

  const deleteExercise = async () => {
    if (formValues) {
      await Api.task.deleteTask(formValues.task_id);
      goBack();
    }
  };

  const saveChanges = async () => {
    if (formValues) {
      await Api.task.updateTask(normalizeSetValues(formValues));
      goBack();
    }
  };

  return (
    <PageLayout
      onBackClick={saveChanges}
      extra={<DeleteButton onDelete={deleteExercise} />}
    >
      {formValues ? (
        <WorkoutExerciseForm
          exercise={exercise!}
          workout={workout!}
          onChange={setFormValues}
        />
      ) : (
        <Empty description="Упражнение не найдено" />
      )}
    </PageLayout>
  );
};

export default Page;
