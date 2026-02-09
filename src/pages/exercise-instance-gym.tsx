import {
  ExerciseInstanceForm,
  exerciseModel,
  normalizeSetValues,
} from '@/entities/exercise';
import { Api, TaskGroupStatus } from '@/shared/api';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Route } from './+types/exercise-instance-gym';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.task.getTaskByTaskId(+params.exId);
};

const Page = ({ params, loaderData: initialValues }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<exerciseModel.ExerciseInstance>(
    initialValues!,
  );

  const status = params.status as TaskGroupStatus;

  const goBack = () => navigate('../');

  const saveChanges = async () => {
    await Api.task.updateTask(normalizeSetValues(formValues));
    goBack();
  };

  return (
    <PageDrawer
      open
      title="Упражнение"
      style={{ overflow: 'hidden' }}
      styles={{ body: { overflow: 'hidden' } }}
      onClose={saveChanges}
    >
      <ExerciseInstanceForm
        type="fact"
        masterId={+params.mId}
        values={initialValues!}
        status={status}
        onChange={setFormValues}
      />
    </PageDrawer>
  );
};

export default Page;
