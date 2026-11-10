import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { formatHistorySet } from '../lib/format-history-set';
import type { ExerciseHistoryEntry } from '../lib/to-history-entries';

type Props = {
  entries: ExerciseHistoryEntry[];
};

export const ExerciseHistoryList = ({ entries }: Props) => {
  const { t } = useTranslation();
  const { token } = useTheme();

  return (
    <Flex
      flex={1}
      gap={token.paddingSM}
      style={{ minHeight: 0, overflowY: 'auto' }}
    >
      {entries.map((entry) => (
        <Flex
          key={entry.key}
          gap={token.paddingXS}
          p={token.paddingSM}
          style={{
            flexShrink: 0,
            backgroundColor: token.colorBgLayout,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Flex
            vertical={false}
            align="center"
            justify="space-between"
            gap={token.paddingXS}
          >
            <Typography.Text strong>
              {entry.date ? formatDate(entry.date) : entry.key}
            </Typography.Text>

            <Typography.Text type="secondary">
              {`${entry.sets.length} ${t('exercise.sets', {
                count: entry.sets.length,
              })}`}
            </Typography.Text>
          </Flex>

          <Flex gap={4}>
            {entry.sets.map((set, index) => (
              <Flex
                key={`${entry.key}-${index}`}
                vertical={false}
                align="baseline"
                gap={token.paddingXS}
              >
                <Typography.Text
                  type="secondary"
                  style={{ width: 20, flexShrink: 0 }}
                >
                  {index + 1}
                </Typography.Text>

                <Typography.Text>{formatHistorySet(set, t)}</Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
