import { workoutModel } from '@/entities/workout';
import { CreateExerciseInstanceButton } from '@/features/create-exercise-instance';
import { Api, TaskGroupStatus } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExercises } from '@/widgets/workout-exercises';
import { Button, Form, Input } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Route } from './+types/workout-details';

type FormValues = workoutModel.Workout;

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup.taskGroupById(+params.wId);
};

const Page = ({ loaderData: workout, params }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const goBack = useNavigateBack();

  const [form] = Form.useForm<FormValues>();

  const initialData = useMemo<DeepPartial<FormValues>>(
    () => ({ ...workout }),
    [workout],
  );

  const status = params.status as TaskGroupStatus;
  const readonly = status === TaskGroupStatus.Finished;

  const goToWorkouts = (status: TaskGroupStatus) => {
    navigate(`../../../${status}`, { relative: 'path' });
  };

  const submitChanges = async () => {
    try {
      if (form.isFieldTouched('title')) {
        await Api.taskGroup.updateTaskGroupTitle(workout!.task_group_id, {
          title: form.getFieldValue('title') || 'Без названия',
        });
      }
      if (status === TaskGroupStatus.Planned) {
        await Api.taskGroup.updateTaskGroupStatus(+params.wId, {
          status: TaskGroupStatus.Running,
        });
        goToWorkouts(TaskGroupStatus.Running);
      }
    } catch {
      goBack();
    }
  };

  const finishWorkout = async () => {
    try {
      await Api.taskGroup.updateTaskGroupStatus(+params.wId, {
        status: TaskGroupStatus.Finished,
      });
      goToWorkouts(TaskGroupStatus.Finished);
    } catch {
      goBack();
    }
  };

  return (
    <PageLayout
      title="Выполнение тренировки"
      onBackClick={submitChanges}
      extra={
        <Button type="primary" onClick={finishWorkout}>
          Завершить
        </Button>
      }
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

          <CreateExerciseInstanceButton workoutId={workout.task_group_id} />

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
