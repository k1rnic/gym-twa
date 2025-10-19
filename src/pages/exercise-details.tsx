import { Route } from '.react-router/types/src/pages/+types/exercise-details';
import { exerciseModel } from '@/entities/exercise';
import { useViewer } from '@/entities/viewer/model';
import { Api, ExerciseStatus } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { Button, Descriptions, DescriptionsProps, Form } from 'antd';
import Input from 'antd/es/input/Input';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.exercise.getExercise(+params.exId);
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const viewer = useViewer();
  const [form] = Form.useForm<exerciseModel.ExerciseDetailed>();

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Название',
      children: loaderData.exercise_name,
    },
    {
      key: '2',
      label: 'Описание',
      children: loaderData.description,
    },
  ];

  const isMine = viewer.master?.master_id === loaderData.master_id;
  const canEdit = isMine && loaderData.status === ExerciseStatus.Active;

  const initialData = useMemo<Partial<exerciseModel.ExerciseDetailed>>(
    () => loaderData,
    [loaderData],
  );

  const goBack = () => navigate('../');

  const handleSubmit = (formData: exerciseModel.ExerciseDetailed) => {
    // props.onSubmit(formData);
  };

  return (
    <PageDrawer
      open
      title={canEdit ? 'Редактирование упражнение' : 'Просмотр упражнения'}
      width="100%"
      onClose={goBack}
    >
      <Descriptions items={items} />
      {/* <Form<exerciseModel.ExerciseDetailed>
        form={form}
        disabled={!canEdit}
        initialValues={initialData}
        size="middle"
        onFinish={handleSubmit}
      >
        <Flex flex={1}>
          <Form.Item<exerciseModel.ExerciseDetailed>
            name="exercise_name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Название" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item<exerciseModel.ExerciseDetailed> name="description">
            <Input placeholder="Описание" multiple style={{ width: '100%' }} />
          </Form.Item>

          {canEdit && (
            <Button block type="primary" htmlType="submit">
              Сохранить
            </Button>
          )}
        </Flex>
      </Form> */}
    </PageDrawer>
  );
};

export default Page;
