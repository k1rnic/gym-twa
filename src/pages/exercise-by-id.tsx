import { exerciseModel } from '@/entities/exercise';
import { useViewer } from '@/entities/viewer/model';
import { useDeleteExerciseResource } from '@/features/exercise/delete-resource';
import { ExerciseUploadFileModal } from '@/features/exercise/upload-file';
import { Api, ExerciseStatus } from '@/shared/api';
import { useToggle } from '@/shared/lib/hooks';
import { useNavigateBackButton } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { GridPreview } from '@/shared/ui/grid-preview';
import { PageLayout } from '@/shared/ui/page-layout';
import { Button, Form, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import { useTheme } from '@/shared/lib/theme';
import { DeleteButton } from '@/shared/ui/delete-button';
import { SectionTitle } from '@/shared/ui/section-title';
import { TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';
import { Route } from './+types/exercise-by-id';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.exercise.getExercise(+params.exId);
};

const Page = ({ loaderData: initialValues }: Route.ComponentProps) => {
  const { token } = useTheme();
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();

  const goBack = useNavigateBackButton();

  const viewer = useViewer();
  const [form] = Form.useForm<exerciseModel.ExerciseDetailed>();
  const skipSaveOnUnmount = useRef(false);

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

  const saveChanges = useCallback(async () => {
    if (canEdit && !skipSaveOnUnmount.current) {
      try {
        await Api.exercise.updateExercise(form.getFieldsValue(true));
        revalidate();
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const deleteExercise = async () => {
    skipSaveOnUnmount.current = true;
    await Api.exercise.deleteExercise(initialValues.exercise_id!);
    goBack();
  };

  useEffect(() => {
    return () => {
      saveChanges();
    };
  }, [saveChanges]);

  return (
    <PageLayout>
      <Flex height="100%" style={{ overflowY: 'auto' }}>
        <Form<exerciseModel.ExerciseDetailed>
          form={form}
          initialValues={initialValues}
          size="middle"
          disabled={!canEdit}
        >
          <Form.Item<exerciseModel.ExerciseDetailed>
            name="exercise_name"
            label={t('exercise.name')}
          >
            <TextArea autoSize size="large" />
          </Form.Item>

          <Form.Item<exerciseModel.ExerciseDetailed>
            name="description"
            label={t('exercise.description')}
          >
            <TextArea size="large" autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>
        </Form>

        <Space size={24} direction="vertical">
          <Space
            direction="vertical"
            style={{ width: '100%', overflow: 'hidden' }}
          >
            <SectionTitle hidden={!canEdit && !items.length}>
              {t('exercise.files')}
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
                  icon={<TrashIcon />}
                  hidden={!canEdit}
                  onClick={() => deleteExerciseResource(files[current])}
                />
              )}
            />
          </Space>
        </Space>
      </Flex>

      <DeleteButton
        hidden={!canEdit}
        onDelete={deleteExercise}
        size="middle"
        style={{ marginBottom: token.marginSM, zIndex: 999 }}
      />

      <ExerciseUploadFileModal
        opened={uploadModalOpened}
        exerciseId={initialValues.exercise_id!}
        onClose={toggleUploadModal}
      />
    </PageLayout>
  );
};

export default Page;
