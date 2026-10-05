import { formatMonthYear } from '@/shared/lib/date';
import { Typography } from 'antd';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

type MonthGroupHeaderProps = {
  date: Date | null;
  style?: CSSProperties;
};

export const MonthGroupHeader = ({ date, style }: MonthGroupHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Typography.Text
      strong
      type="secondary"
      style={{ display: 'block', ...style }}
    >
      {date ? formatMonthYear(date) : t('common.invalidDate')}
    </Typography.Text>
  );
};
