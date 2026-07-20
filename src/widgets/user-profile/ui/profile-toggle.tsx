import { ActionListItem } from '@/shared/ui/action-list-item';
import { EyeSlashIcon } from '@phosphor-icons/react';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib';
import { useTranslation } from 'react-i18next';

export type ProfileToggleProps = SwitchProps;

export const ProfileToggle = (switchProps: ProfileToggleProps) => {
  const { t } = useTranslation();

  return (
    <ActionListItem
      icon={<EyeSlashIcon weight="fill" />}
      extra={<Switch size="default" {...switchProps} />}
    >
      {t('profile.hideProfile')}
    </ActionListItem>
  );
};
