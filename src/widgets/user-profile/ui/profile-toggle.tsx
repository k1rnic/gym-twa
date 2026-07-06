import { ActionListItem } from '@/shared/ui/action-list-item';
import { EyeSlashIcon } from '@phosphor-icons/react';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib';

export type ProfileToggleProps = SwitchProps;

export const ProfileToggle = (switchProps: ProfileToggleProps) => {
  return (
    <ActionListItem
      icon={<EyeSlashIcon weight="fill" />}
      extra={<Switch size="default" {...switchProps} />}
    >
      Скрыть профиль
    </ActionListItem>
  );
};
