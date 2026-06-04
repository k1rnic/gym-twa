import { viewerModel } from '@/entities/viewer';
import { workoutModel } from '@/entities/workout';
import { CreateExerciseInstanceButton } from '@/features/create-exercise-instance';
import { Api, TaskGroupStatus } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExercises } from '@/widgets/workout-exercises';
import { Form, Input } from 'antd';
import { useMemo } from 'react';
import { Route } from './+types/workout-details';

type FormValues = workoutModel.Workout;

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup.taskGroupById(+params.wId);
};

const Page = ({ loaderData: workout, params }: Route.ComponentProps) => {
  const goBack = useNavigateBack();

  const viewer = viewerModel.useViewer();

  const [form] = Form.useForm<FormValues>();

  const initialData = useMemo<DeepPartial<FormValues>>(
    () => ({ ...workout }),
    [workout],
  );

  const status = params.status as TaskGroupStatus;
  const canAccess =
    workout?.gymer_id === viewer.gymer?.gymer_id &&
    status !== TaskGroupStatus.Finished;

  const readonly = !(status === TaskGroupStatus.Planned || canAccess);

  const deleteWorkout = async () => {
    try {
      await Api.taskGroup.deleteTaskGroup(workout!.task_group_id);
    } finally {
      goBack();
    }
  };

  const submitChanges = async () => {
    try {
      if (form.isFieldTouched('title')) {
        await Api.taskGroup.updateTaskGroupTitle(workout!.task_group_id, {
          title: form.getFieldValue('title') || 'Без названия',
        });
      }
    } finally {
      goBack();
    }
  };

  return (
    <PageLayout
      title="Создание тренировки"
      onBackClick={submitChanges}
      extra={<DeleteButton hidden={readonly} onDelete={deleteWorkout} />}
    >
      {workout && (
        <Flex
          height="100%"
          style={{ overflow: 'hidden', position: 'relative' }}
        >
          <Form<FormValues>
            form={form}
            initialValues={initialData}
            size="middle"
            disabled={readonly}
          >
            <Form.Item<FormValues> name="title">
              <Input style={{ width: '100%' }} placeholder="Название" />
            </Form.Item>
          </Form>

          {!readonly && (
            <CreateExerciseInstanceButton workoutId={workout.task_group_id} />
          )}

          <WorkoutExercises
            exercises={workout.tasks ?? []}
            readonly={readonly}
          />
        </Flex>
      )}
    </PageLayout>
  );
};

export default Page;
