import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseHistoryDrawer } from './exercise-history-drawer';

export type ExerciseHistoryButtonProps = {
  exerciseId?: number | null;
  gymerId?: number | null;
  exerciseName?: string | null;
  withLabel?: boolean;
  size?: ButtonProps['size'];
};

export const ExerciseHistoryButton = ({
  exerciseId,
  gymerId,
  exerciseName,
  withLabel = false,
  size,
}: ExerciseHistoryButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!exerciseId || !gymerId) {
    return null;
  }

  return (
    <ConfigProvider componentDisabled={false}>
      <Button
        type={withLabel ? 'default' : 'text'}
        size={size}
        icon={<ClockCounterClockwiseIcon size={20} />}
        aria-label={t('exercise.history.button')}
        onClick={() => setOpen(true)}
      >
        {withLabel ? t('exercise.history.button') : null}
      </Button>

      <ExerciseHistoryDrawer
        open={open}
        exerciseId={exerciseId}
        gymerId={gymerId}
        exerciseName={exerciseName}
        onClose={() => setOpen(false)}
      />
    </ConfigProvider>
  );
};
