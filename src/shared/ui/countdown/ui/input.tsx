import { FieldTimeOutlined } from '@ant-design/icons';
import { InputNumber, InputNumberProps } from 'antd';

export type CountDownInputProps = InputNumberProps;

export const CountDownInput = ({ ...props }: CountDownInputProps) => {
  return (
    <InputNumber
      inputMode="numeric"
      controls={false}
      prefix={<FieldTimeOutlined />}
      suffix="сек"
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  );
};
