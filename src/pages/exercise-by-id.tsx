import { exerciseModel } from '@/entities/exercise';
import { useViewer } from '@/entities/viewer/model';
import { useDeleteExerciseResource } from '@/features/exercise/delete-resource';
import { ExerciseUploadFileModal } from '@/features/exercise/upload-file';
import { Api, ExerciseStatus } from '@/shared/api';
import { useToggle } from '@/shared/lib/hooks';
import {
  useNavigateBackButton,
  useTelegramBackButton,
} from '@/shared/lib/router';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import { GridPreview } from '@/shared/ui/grid-preview';
import { PageLayout } from '@/shared/ui/page-layout';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import { SectionTitle } from '@/shared/ui/section-title';
import { useMemo } from 'react';
import { Route } from './+types/exercise-by-id';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.exercise.getExercise(+params.exId);
};

const Page = ({ loaderData: initialValues }: Route.ComponentProps) => {
  const goBack = useNavigateBackButton();

  const viewer = useViewer();
  const [form] = Form.useForm<exerciseModel.ExerciseDetailed>();

  const formValues = Form.useWatch([], form) as
    | exerciseModel.ExerciseDetailed
    | undefined;

  const files = useMemo(
    () => initialValues?.url_path_list ?? [],
    [initialValues?.url_path_list],
  );

  const items = useMemo(
    () =>
      files.map((f) => ({ url: f.url_path, type: f.url_path_type, meta: f })),
    [files],
  );

  const isMine = viewer.master?.master_id === initialValues.master_id;
  const canEdit = isMine && initialValues.status === ExerciseStatus.Active;

  const [uploadModalOpened, toggleUploadModal] = useToggle();

  const deleteExerciseResource = useDeleteExerciseResource(
    initialValues.exercise_id!,
  );

  const saveChanges = async () => {
    if (canEdit) {
      await Api.exercise.updateExercise({
        ...initialValues,
        ...formValues,
        exercise_name: formValues?.exercise_name ?? '',
      });
    }
  };

  const deleteExercise = async () => {
    await Api.exercise.deleteExercise(initialValues.exercise_id!);
    goBack();
  };

  useTelegramBackButton({ beforeUnmount: saveChanges });

  return (
    <PageLayout extra={canEdit && <DeleteButton onDelete={deleteExercise} />}>
      <Flex height="100%" style={{ overflowY: 'auto' }}>
        <Form<exerciseModel.ExerciseDetailed>
          form={form}
          initialValues={initialValues}
          size="middle"
          disabled={!canEdit}
        >
          <Form.Item<exerciseModel.ExerciseDetailed> name="exercise_name">
            <TextArea autoSize placeholder="Название" size="large" />
          </Form.Item>

          <Form.Item<exerciseModel.ExerciseDetailed> name="description">
            <TextArea
              size="large"
              placeholder="Описание"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
        </Form>

        <Space size={24} direction="vertical">
          <Space direction="vertical" style={{ width: '100%' }}>
            <SectionTitle hidden={!canEdit && !items.length}>
              Файлы
            </SectionTitle>

            <GridPreview
              items={items}
              readOnly={!canEdit}
              onAddClick={toggleUploadModal}
              renderToolbar={(_, { current }) => (
                <Button
                  size="large"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  hidden={!canEdit}
                  onClick={() => deleteExerciseResource(files[current])}
                />
              )}
            />
          </Space>
        </Space>
      </Flex>

      <ExerciseUploadFileModal
        opened={uploadModalOpened}
        exerciseId={initialValues.exercise_id!}
        onClose={toggleUploadModal}
      />
    </PageLayout>
  );
};

export default Page;
