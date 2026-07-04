import { Api } from '@/shared/api';
import { useTelegramBackButton } from '@/shared/lib/router';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExerciseForm } from '@/widgets/workout-exercise-form';
import { normalizeSetValues } from '@/widgets/workout-exercise-form/lib/normalize-set-values';
import { Empty } from 'antd';
import { useState } from 'react';
import { Route } from './+types/workout-exercise-by-id';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const workout = await Api.taskGroup.taskGroupById(+params.wId);
  const exercise = await Api.task.getTaskByTaskId(+params.exId);

  return { workout, exercise };
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  const { workout, exercise } = loaderData;

  const [formValues, setFormValues] = useState(exercise);

  const saveChanges = async () => {
    if (formValues) {
      await Api.task.updateTask(normalizeSetValues(formValues));
    }
  };

  useTelegramBackButton({ beforeUnmount: saveChanges });

  return (
    <PageLayout>
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
