import { useWorkoutPermissions, workoutModel } from '@/entities/workout';
import { CreateExerciseInstanceButton } from '@/features/create-exercise-instance';
import { Api, TaskGroupStatus } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { FloatButton } from '@/shared/ui/float-button';
import { PageLayout } from '@/shared/ui/page-layout';
import { WorkoutExerciseList } from '@/widgets/workout-exercise-list';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { useEffect, useMemo } from 'react';
import { useRevalidator } from 'react-router';
import { Route } from './+types/workout-details';

type FormValues = workoutModel.Workout;

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup.taskGroupById(+params.wId);
};

const Page = ({ loaderData: workout }: Route.ComponentProps) => {
  const { revalidate } = useRevalidator();
  const goBack = useNavigateBack();

  const { token } = useTheme();

  const permissions = useWorkoutPermissions(workout!);

  const [form] = Form.useForm<FormValues>();

  const initialData = useMemo<DeepPartial<FormValues>>(
    () => ({ ...workout }),
    [workout],
  );

  const changeWorkoutStatus = async (status: TaskGroupStatus) => {
    try {
      await Api.taskGroup.updateTaskGroupStatus(workout!.task_group_id, {
        status,
      });
      revalidate();
    } catch (e) {
      console.error(e);
    }
  };

  const startWorkout = () => changeWorkoutStatus(TaskGroupStatus.Running);
  const finishWorkout = () => changeWorkoutStatus(TaskGroupStatus.Finished);

  const submitChanges = async () => {
    try {
      const changed = form.getFieldValue('title') !== workout?.title;

      if (changed) {
        await Api.taskGroup.updateTaskGroupTitle(workout!.task_group_id, {
          title: form.getFieldValue('title') || 'Без названия',
        });
        revalidate();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    return () => {
      submitChanges();
    };
  }, []);

  return (
    <PageLayout onBackClick={goBack}>
      {workout && (
        <Flex
          height="100%"
          style={{ overflow: 'hidden', position: 'relative' }}
        >
          <Form<FormValues>
            form={form}
            initialValues={initialData}
            size="middle"
            disabled={!permissions.modifyWorkout}
          >
            <Form.Item<FormValues> name="title">
              <Input style={{ width: '100%' }} placeholder="Название" />
            </Form.Item>
          </Form>

          <Flex gap={token.paddingXS}>
            <WorkoutExerciseList
              w={workout}
              data={workout.tasks ?? []}
              reorderEnabled={permissions.isOwner || permissions.isGymmer}
            />
            <CreateExerciseInstanceButton workout={workout} />
          </Flex>

          <FloatButton
            icon={<CaretRightOutlined />}
            hidden={!permissions.runWorkout}
            onClick={startWorkout}
          />

          <FloatButton
            danger
            icon={<PauseOutlined />}
            hidden={!permissions.finishWorkout}
            onClick={finishWorkout}
          />
        </Flex>
      )}
    </PageLayout>
  );
};

export default Page;
