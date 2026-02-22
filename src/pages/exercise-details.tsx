import { Route } from '.react-router/types/src/pages/+types/exercise-details';
import { exerciseModel } from '@/entities/exercise';
import { useViewer } from '@/entities/viewer/model';
import { useDeleteExerciseResource } from '@/features/exercise/delete-resource';
import { useExerciseImagePicker } from '@/features/exercise/upload-image';
import { ExerciseVideoUploadModal } from '@/features/exercise/upload-video';
import { Api, ExerciseStatus, UrlPathType } from '@/shared/api';
import { useToggle } from '@/shared/lib/hooks';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { GridPreview } from '@/shared/ui/grid-preview';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { DeleteOutlined } from '@ant-design/icons';
import { Form, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/lib/typography/Title';
import { useMemo } from 'react';
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

  const imageLinks = useMemo(
    () =>
      initialValues?.url_path_list?.filter(
        (i) => i.url_path_type === UrlPathType.Image,
      ) ?? [],
    [initialValues?.url_path_list],
  );

  const imagesUrls = useMemo(
    () => imageLinks.map((i) => i.url_path),
    [imageLinks],
  );

  const videoLinks = useMemo(
    () =>
      initialValues?.url_path_list?.filter(
        (i) => i.url_path_type === UrlPathType.Video,
      ) ?? [],
    [initialValues?.url_path_list],
  );

  const videosUrls = useMemo(
    () => videoLinks.map((i) => i.url_path),
    [videoLinks],
  );

  const isMine = viewer.master?.master_id === initialValues.master_id;
  const canEdit = isMine && initialValues.status === ExerciseStatus.Active;

  const uploadExerciseImage = useExerciseImagePicker(
    initialValues.exercise_id!,
  );

  const [videoUploadOpened, toggleVideoUpload] = useToggle();

  const deleteExerciseResource = useDeleteExerciseResource(
    initialValues.exercise_id!,
  );

  const goBack = () => navigate(-1);

  const saveChanges = async () => {
    if (canEdit) {
      await Api.exercise.updateExercise({
        ...initialValues,
        ...formValues,
        exercise_name: formValues?.exercise_name ?? '',
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
      title="Шаблон"
      onClose={saveChanges}
      extra={canEdit && <DeleteButton onDelete={deleteExercise} />}
    >
      <Flex height="100%" style={{ overflowY: 'auto' }}>
        <Form<exerciseModel.ExerciseDetailed>
          form={form}
          initialValues={initialValues}
          size="middle"
          disabled={!canEdit}
        >
          <Form.Item<exerciseModel.ExerciseDetailed> name="exercise_name">
            <TextArea autoSize placeholder="Название" />
          </Form.Item>

          <Form.Item<exerciseModel.ExerciseDetailed> name="description">
            <TextArea
              placeholder="Описание"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
        </Form>

        <Space size={24} direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>
              Фото
            </Title>

            <GridPreview
              readonly={!canEdit}
              itemType="image"
              items={imagesUrls}
              onAddClick={uploadExerciseImage}
              renderToolbar={(_, { current }) => (
                <DeleteOutlined
                  hidden={!canEdit}
                  style={{ fontSize: 24 }}
                  onClick={() => deleteExerciseResource(imageLinks[current])}
                />
              )}
            />
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>
              Видео
            </Title>

            <GridPreview
              visibleCount={2}
              readonly={!canEdit}
              itemType="video"
              items={videosUrls}
              onAddClick={toggleVideoUpload}
              renderToolbar={(_, { current }) => (
                <DeleteOutlined
                  hidden={!canEdit}
                  style={{ fontSize: 24 }}
                  onClick={() => deleteExerciseResource(videoLinks[current])}
                />
              )}
            />
          </Space>
        </Space>
      </Flex>

      <ExerciseVideoUploadModal
        opened={videoUploadOpened}
        exerciseId={initialValues.exercise_id!}
        onClose={toggleVideoUpload}
      />
    </PageDrawer>
  );
};

export default Page;
