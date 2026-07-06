import { workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExerciseForm } from '@/widgets/workout-exercise-form';
import { normalizeSetValues } from '@/widgets/workout-exercise-form/lib/normalize-set-values';
import { Empty } from 'antd';
import { useRevalidator } from 'react-router';
import { Route } from './+types/workout-exercise-by-id';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const workout = await Api.taskGroup.taskGroupById(+params.wId);
  const exercise = await Api.task.getTaskByTaskId(+params.exId);

  return { workout, exercise };
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  const { workout, exercise } = loaderData;
  const { revalidate } = useRevalidator();

  const saveChanges = async (values: workoutModel.WorkoutExercise) => {
    try {
      await Api.task.updateTask(normalizeSetValues(values));
      revalidate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageLayout>
      {workout && exercise ? (
        <WorkoutExerciseForm
          exercise={exercise}
          workout={workout}
          onSubmit={saveChanges}
        />
      ) : (
        <Empty description="Упражнение не найдено" />
      )}
    </PageLayout>
  );
};

export default Page;
