import { useTheme } from '@/shared/lib/theme';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';

export type ProfileDescriptionProps = TextAreaProps;

export const ProfileDescription = (textAreaProps: ProfileDescriptionProps) => {
  const { token } = useTheme();

  return (
    <Input.TextArea
      placeholder="Расскажите о себе"
      autoSize={{ minRows: 3, maxRows: 6 }}
      size="large"
      {...textAreaProps}
    />
  );
};
