import { ActionListItem } from '@/shared/ui/action-list-item';
import { Switch } from 'antd';
import { SwitchProps } from 'antd/lib';

export type ProfileToggleProps = SwitchProps;

export const ProfileToggle = (switchProps: ProfileToggleProps) => {
  return (
    <ActionListItem extra={<Switch size="default" {...switchProps} />}>
      Скрыть профиль
    </ActionListItem>
  );
};
