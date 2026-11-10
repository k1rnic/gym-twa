import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { XIcon } from '@phosphor-icons/react';
import { Button, Drawer, Empty, Skeleton, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { useExerciseHistory } from '../lib/use-exercise-history';
import { ExerciseHistoryList } from './exercise-history-list';

export type ExerciseHistoryDrawerProps = {
  open: boolean;
  exerciseId: number;
  gymerId: number;
  exerciseName?: string | null;
  onClose: () => void;
};

type ContentProps = {
  exerciseId: number;
  gymerId: number;
  enabled: boolean;
};

const Content = ({ exerciseId, gymerId, enabled }: ContentProps) => {
  const { t } = useTranslation();

  const { entries, loading, error, retry } = useExerciseHistory(
    exerciseId,
    gymerId,
    enabled,
  );

  if (loading) {
    return (
      <Flex flex={1} style={{ minHeight: 0, overflow: 'hidden' }}>
        <Skeleton active title paragraph={{ rows: 6 }} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex flex={1} align="center" justify="center" style={{ minHeight: 0 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('exercise.history.error')}
        >
          <Button type="primary" onClick={retry}>
            {t('exercise.history.retry')}
          </Button>
        </Empty>
      </Flex>
    );
  }

  if (!entries.length) {
    return (
      <Flex flex={1} align="center" justify="center" style={{ minHeight: 0 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('exercise.history.empty')}
        />
      </Flex>
    );
  }

  return <ExerciseHistoryList entries={entries} />;
};

export const ExerciseHistoryDrawer = ({
  open,
  exerciseId,
  gymerId,
  onClose,
}: ExerciseHistoryDrawerProps) => {
  const { t } = useTranslation();
  const { token } = useTheme();

  return (
    <Drawer
      destroyOnHidden
      placement="bottom"
      height="85%"
      open={open}
      closable={false}
      onClose={onClose}
      styles={{
        header: { padding: 0 },
        body: {
          padding: token.paddingSM,
          paddingTop: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
      title={
        <Flex
          vertical={false}
          align="center"
          justify="space-between"
          style={{ textAlign: 'center' }}
          py={token.padding}
          px={token.paddingSM}
        >
          <Button
            type="text"
            icon={<XIcon />}
            aria-label={t('common.close')}
            onClick={onClose}
          />

          <Flex vertical align="center" flex={1} style={{ minWidth: 0 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {t('exercise.history.title')}
            </Typography.Title>
          </Flex>

          <span style={{ width: 40 }} />
        </Flex>
      }
    >
      <Content exerciseId={exerciseId} gymerId={gymerId} enabled={open} />
    </Drawer>
  );
};
