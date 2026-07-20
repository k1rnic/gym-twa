import { useTheme } from '@/shared/lib/theme';
import { TimerIcon } from '@phosphor-icons/react';
import { InputNumber, InputNumberProps } from 'antd';
import { useTranslation } from 'react-i18next';

export type CountDownInputProps = InputNumberProps;

export const CountDownInput = ({ ...props }: CountDownInputProps) => {
  const { token } = useTheme();
  const { t } = useTranslation();

  return (
    <InputNumber
      inputMode="numeric"
      controls={false}
      prefix={<TimerIcon color={token.colorText} />}
      size="middle"
      suffix={t('common.seconds')}
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  );
};
