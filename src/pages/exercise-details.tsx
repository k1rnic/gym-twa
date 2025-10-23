import { Route } from '.react-router/types/src/pages/+types/exercise-details';
import { exerciseModel } from '@/entities/exercise';
import { useViewer } from '@/entities/viewer/model';
import { Api, ExerciseStatus } from '@/shared/api';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { Descriptions, DescriptionsProps, Form } from 'antd';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.exercise.getExercise(+params.exId);
};

const Page = ({ loaderData: initialValues }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const viewer = useViewer();
  const [form] = Form.useForm<exerciseModel.ExerciseDetailed>();

  const formValues = Form.useWatch([], form) as
    | exerciseModel.ExerciseDetailed
    | undefined;

  const descriptions: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Название',
      children: initialValues.exercise_name,
    },
    {
      key: '2',
      label: 'Описание',
      children: initialValues.description,
    },
  ];

  const isMine = viewer.master?.master_id === initialValues.master_id;
  const canEdit = isMine && initialValues.status === ExerciseStatus.Active;

  const goBack = () => navigate('../');

  const saveChanges = async () => {
    if (canEdit) {
      await Api.exercise.updateExercise({
        ...initialValues,
        ...formValues,
        exercise_name: formValues?.exercise_name || 'Без названия',
      });
    }
    goBack();
  };

  const deleteExercise = async () => {
    await Api.exercise.deleteExercise(initialValues.exercise_id!);
    goBack();
  };

  return (
    <PageDrawer
      open
      title={canEdit ? 'Редактирование упражнения' : 'Просмотр упражнения'}
      width="100%"
      onClose={saveChanges}
    >
      <Flex height="100%" style={{ overflow: 'hidden' }}>
        <Flex flex={1}>
          {canEdit ? (
            <Form<exerciseModel.ExerciseDetailed>
              form={form}
              initialValues={initialValues}
              size="middle"
            >
              <Form.Item<exerciseModel.ExerciseDetailed> name="exercise_name">
                <Input placeholder="Название" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item<exerciseModel.ExerciseDetailed> name="description">
                <TextArea
                  placeholder="Описание"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          ) : (
            <Descriptions items={descriptions} />
          )}
        </Flex>
        {canEdit && <DeleteButton onDelete={deleteExercise} />}
      </Flex>
    </PageDrawer>
  );
};

export default Page;
