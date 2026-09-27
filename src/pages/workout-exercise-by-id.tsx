import { workoutModel } from '@/entities/workout';
import { saveWorkoutExercise } from '@/features/save-workout-exercise';
import { Api } from '@/shared/api';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExerciseForm } from '@/widgets/workout-exercise-form';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const saveChanges = async (values: workoutModel.WorkoutExercise) => {
    try {
      await saveWorkoutExercise(workout!, exercise!, values);
      revalidate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageLayout>
      {workout && exercise ? (
        <WorkoutExerciseForm
          key={exercise.task_id}
          exercise={exercise}
          workout={workout}
          onSubmit={saveChanges}
        />
      ) : (
        <Empty description={t('exercise.notFound')} />
      )}
    </PageLayout>
  );
};

export default Page;
