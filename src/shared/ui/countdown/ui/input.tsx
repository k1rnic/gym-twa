import { useTheme } from '@/shared/lib/theme';
import { TimerIcon } from '@phosphor-icons/react';
import { InputNumber, InputNumberProps } from 'antd';

export type CountDownInputProps = InputNumberProps;

export const CountDownInput = ({ ...props }: CountDownInputProps) => {
  const { token } = useTheme();

  return (
    <InputNumber
      inputMode="numeric"
      controls={false}
      prefix={<TimerIcon color={token.colorText} />}
      size="middle"
      suffix="сек"
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  );
};
