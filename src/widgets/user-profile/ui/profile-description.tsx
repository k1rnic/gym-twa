import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { useTranslation } from 'react-i18next';

export type ProfileDescriptionProps = TextAreaProps;

export const ProfileDescription = (textAreaProps: ProfileDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <Input.TextArea
      placeholder={t('profile.tellAboutYou')}
      autoSize={{ maxRows: 6 }}
      size="large"
      {...textAreaProps}
    />
  );
};
