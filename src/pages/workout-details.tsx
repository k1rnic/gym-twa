import { exerciseModel } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { Api, TaskGroupStatus } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input } from 'antd';
import { DescriptionsItemType } from 'antd/lib/descriptions';
import { useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/workout-details';
import { DeleteButton } from '@/shared/ui/delete-button';

type FormValues = workoutModel.Workout;

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup
    .listTaskGroup({
      gymer_id: +params.gId,
      master_id: +params.mId,
    })
    .then((data) => data.find((group) => group.task_group_id === +params.wId));
};

const Page = ({ loaderData: workout, params }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const [form] = Form.useForm<FormValues>();

  const initialData = useMemo<DeepPartial<FormValues>>(
    () => ({ ...workout }),
    [workout],
  );

  const status = params.status as TaskGroupStatus;

  const getExerciseDescriptions = useCallback(
    (ex: exerciseModel.ExerciseInstance): DescriptionsItemType[] => [
      {
        key: 'rest',
        label: 'Отдых',
        children: `${ex.task_properties?.rest || 0} сек`,
      },
      ...(ex.task_properties?.sets?.map((s, idx) => ({
        key: s.set_id,
        label: `${idx + 1} Подход`,
        children: `${s.plan_value ?? 0} кг x ${s.plan_rep ?? 0} раз`,
      })) ?? []),
    ],
    [],
  );

  const goToExercise = (id: exerciseModel.ExerciseInstance['task_id']) => {
    navigate(`${id}`);
  };

  const createExerciseInstance = async () => {
    try {
      const instance = await Api.task.createTask({
        task_group_id: workout!.task_group_id,
      });
      navigate(`${instance?.task_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWorkout = async () => {
    try {
      await Api.taskGroup.updateTaskGroupStatus(workout!.task_group_id);
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
      open
      placement="bottom"
      title="Тренировка"
      height="100%"
      onClose={submitChanges}
    >
      <Flex height="100%" style={{ overflow: 'hidden' }}>
        <Form<FormValues> form={form} initialValues={initialData} size="middle">
          <Form.Item<FormValues> name="title">
            <Input style={{ width: '100%' }} placeholder="Название" />
          </Form.Item>
        </Form>

        <Form.Item hidden={status !== TaskGroupStatus.Planned}>
          <Button
            block
            size="middle"
            type="dashed"
            className="m-5"
            onClick={createExerciseInstance}
            icon={<PlusOutlined />}
          >
            Добавить упражнение
          </Button>
        </Form.Item>

        <Flex flex={1} gap={8} style={{ overflow: 'auto' }}>
          {workout?.tasks?.map((ex) => (
            <Card
              key={ex.task_id}
              size="small"
              title={ex.exercise?.exercise_name ?? 'Не выбрано'}
              onClick={() => goToExercise(ex.task_id)}
            >
              <Descriptions column={1} items={getExerciseDescriptions(ex)} />
            </Card>
          ))}
        </Flex>

        <DeleteButton onDelete={deleteWorkout} />
      </Flex>

      <Outlet />
    </PageDrawer>
  );
};

export default Page;
