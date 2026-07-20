import { useTheme } from '@/shared/lib/theme';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

export const PolicyContent = () => {
  const { t } = useTranslation();
  const { token } = useTheme();

  return (
    <Typography.Paragraph
      style={{
        margin: 0,
        whiteSpace: 'pre-wrap',
        color: token.colorText,
      }}
    >
      {t('policy.body')}
    </Typography.Paragraph>
  );
};
