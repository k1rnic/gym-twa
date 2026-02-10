import {
  ExerciseInstanceForm,
  exerciseModel,
  normalizeSetValues,
} from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api, TaskGroupStatus } from '@/shared/api';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Route } from './+types/exercise-instance-details';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.task.getTaskByTaskId(+params.exId);
};

const Page = ({ params, loaderData: initialValues }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();

  const [formValues, setFormValues] = useState<exerciseModel.ExerciseInstance>(
    initialValues!,
  );

  const status = params.status as TaskGroupStatus;
  const isMine = +params.gId === viewer.gymer?.gymer_id;

  const readonly = !(status === TaskGroupStatus.Planned || isMine);

  const goBack = () => navigate('../');

  const deleteExercise = async () => {
    await Api.task.deleteTask(initialValues!.task_id);
    goBack();
  };

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
      extra={<DeleteButton hidden={readonly} onDelete={deleteExercise} />}
    >
      <Flex height="100%">
        <ExerciseInstanceForm
          readonly={readonly}
          type="plan"
          masterId={+params.mId}
          values={initialValues!}
          onChange={setFormValues}
        />
      </Flex>
    </PageDrawer>
  );
};

export default Page;
