import { ExerciseInstanceForm, exerciseModel } from '@/entities/exercise';
import { Api, TaskGroupStatus, UpdateTask } from '@/shared/api';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Route } from './+types/exercise-instance-gym';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.task
    .getTasksWithExerciseByGroup(+params.wId)
    .then((data) => data.find((item) => item.task_id === +params.exId)!);
};

const Page = ({ params, loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] =
    useState<exerciseModel.ExerciseInstance>(loaderData);

  const status = params.status as TaskGroupStatus;

  const goBack = () => navigate('../');

  const saveChanges = async () => {
    await Api.task.updateTask(formValues as UpdateTask);
    goBack();
  };

  return (
    <PageDrawer
      open
      title="Упражнение"
      placement="bottom"
      height="100%"
      style={{ overflow: 'hidden' }}
      styles={{ body: { overflow: 'hidden' } }}
      onClose={saveChanges}
    >
      <ExerciseInstanceForm
        type="fact"
        masterId={+params.mId}
        values={loaderData}
        status={status}
        onChange={setFormValues}
      />
    </PageDrawer>
  );
};

export default Page;
