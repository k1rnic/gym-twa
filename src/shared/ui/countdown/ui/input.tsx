import { FieldTimeOutlined } from '@ant-design/icons';
import { InputNumber, InputNumberProps } from 'antd';

export type CountDownInputProps = {
  runEnabled?: boolean;
} & InputNumberProps;

export const CountDownInput = ({
  runEnabled,
  ...props
}: CountDownInputProps) => {
  return (
    <InputNumber
      inputMode="numeric"
      controls={false}
      prefix={<FieldTimeOutlined />}
      suffix="сек"
      style={{
        width: '100%',
        borderTopRightRadius: runEnabled ? 0 : undefined,
        borderBottomRightRadius: runEnabled ? 0 : undefined,
      }}
      {...props}
    />
  );
};
