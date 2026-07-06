import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';

export type ProfileDescriptionProps = TextAreaProps;

export const ProfileDescription = (textAreaProps: ProfileDescriptionProps) => {
  return (
    <Input.TextArea
      placeholder="Расскажите о себе"
      autoSize={{ maxRows: 6 }}
      size="large"
      {...textAreaProps}
    />
  );
};
