import { viewerModel } from '@/entities/viewer';
import { workoutModel } from '@/entities/workout';
import { CreateExerciseInstanceButton } from '@/features/create-exercise-instance';
import { Api, TaskGroupStatus } from '@/shared/api';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { WorkoutExercises } from '@/widgets/workout-exercises';
import { Form, Input } from 'antd';
import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/workout-details';

type FormValues = workoutModel.Workout;

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup.taskGroupById(+params.wId);
};

const Page = ({ loaderData: workout, params }: Route.ComponentProps) => {
  const navigate = useNavigate();
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
      navigate('../');
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
      navigate('../');
    }
  };

  return (
    <PageDrawer
      open={Boolean(workout)}
      title="Создание тренировки"
      onClose={submitChanges}
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

      <Outlet />
    </PageDrawer>
  );
};

export default Page;
