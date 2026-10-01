import { ExerciseList, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { useViewport } from '@/shared/lib/telegram';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { XIcon } from '@phosphor-icons/react';
import { Button, Drawer, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { createWorkoutExercises } from '../lib/create-workout-exercises';

type Props = {
  open: boolean;
  taskGroupId: number;
  onClose: () => void;
  onCreated: () => void;
};

export const ExercisePickerDrawer = ({
  open,
  taskGroupId,
  onClose,
  onCreated,
}: Props) => {
  const { t } = useTranslation();
  const { token } = useTheme();
  const { topSafeArea, bottomSafeArea } = useViewport();
  const navigate = useNavigate();

  const { master, user_id: userId } = viewerModel.useViewer();
  const masterId = master!.master_id!;

  const { data: exercises, loading } = exerciseModel.useExercises(
    masterId,
    open,
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  const busy = creating || creatingTemplate;

  useEffect(() => {
    if (open) return;

    setSelectedIds([]);
    setCreatedCount(0);
  }, [open]);

  const toggleExercise = (exercise: exerciseModel.Exercise) => {
    const exerciseId = exercise.exercise_id;
    if (!exerciseId) return;

    setSelectedIds((current) =>
      current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId],
    );
  };

  const createTemplate = async () => {
    setCreatingTemplate(true);

    let templateId: number | null = null;

    try {
      const template = await Api.exercise.createExercise({
        master_id: masterId,
        exercise_name: '',
        description: '',
        link_ids: [],
      });

      templateId = template.exercise_id ?? null;

      if (!templateId) {
        throw new Error('Exercise template was not created');
      }

      const { created } = await createWorkoutExercises({
        taskGroupId,
        ownerId: userId ?? null,
        exerciseIds: [templateId],
      });

      if (!created.length) {
        throw new Error(`Exercise ${templateId} was not added to workout`);
      }

      onCreated();
      onClose();

      navigate(`/exercises/${templateId}`);
    } catch (error) {
      console.error('Failed to create exercise template', error);

      if (templateId) {
        await Api.exercise.deleteExercise(templateId).catch(() => undefined);
      }

      message.error(t('training.exercisesCreateFailed', { count: 1 }));
    } finally {
      setCreatingTemplate(false);
    }
  };

  const confirmSelection = async () => {
    if (creating || !selectedIds.length) return;

    setCreating(true);
    setCreatedCount(0);

    const { created, failed } = await createWorkoutExercises({
      taskGroupId,
      ownerId: userId ?? null,
      exerciseIds: selectedIds,
      onProgress: setCreatedCount,
    });

    setCreating(false);
    onCreated();

    if (!failed.length) {
      setSelectedIds([]);

      message.success(
        t('training.exercisesCreated', { count: created.length }),
      );
      onClose();
      return;
    }

    setSelectedIds(failed);
    message.error(
      t('training.exercisesCreateFailed', { count: failed.length }),
    );
  };

  return (
    <Drawer
      destroyOnHidden
      closable={false}
      maskClosable={!busy}
      keyboard={!busy}
      open={open}
      placement="bottom"
      height={`calc(90% - ${topSafeArea}px)`}
      style={{ backgroundColor: token.colorBgContainer }}
      styles={{
        header: { padding: 0 },
        body: {
          padding: token.paddingSM,
          paddingBottom: bottomSafeArea,
          display: 'flex',
          flexDirection: 'column',
          gap: token.paddingSM,
          overflow: 'hidden',
        },
      }}
      title={
        <Flex
          align="center"
          vertical={false}
          justify="space-between"
          style={{ textAlign: 'center' }}
          py={token.padding}
          px={token.paddingSM}
        >
          <Button
            size="large"
            type="text"
            disabled={busy}
            onClick={onClose}
            icon={<XIcon />}
          />
          <Typography.Title level={5} style={{ margin: 0, flex: 1 }}>
            {t('exercise.pickerTitle')}
          </Typography.Title>
          <span style={{ width: 40 }} />
        </Flex>
      }
      onClose={onClose}
    >
      <Flex flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
        <ExerciseList
          exercises={exercises}
          masterId={masterId}
          multiple
          selectedIds={selectedIds}
          onSelect={toggleExercise}
        />
      </Flex>

      <Flex vertical={false} gap={token.paddingSM}>
        <Button
          size="middle"
          loading={creatingTemplate}
          disabled={busy}
          onClick={createTemplate}
        >
          {t('exercise.addTemplate')}
        </Button>

        <Button
          block
          size="middle"
          type="primary"
          loading={creating}
          disabled={loading || busy || !selectedIds.length}
          onClick={confirmSelection}
        >
          {creating
            ? `${createdCount} ${t('common.of')} ${selectedIds.length}`
            : t('exercise.addSelected', { count: selectedIds.length })}
        </Button>
      </Flex>
    </Drawer>
  );
};
