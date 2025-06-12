import { Avatar } from '@/shared/ui/avatar';
import { SwapOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import classes from './styles.module.css';

export enum ProfileViews {
  Gymmer = 'gymmer',
  Master = 'master',
}

export type ProfileAvatarProps = {
  mode: ProfileViews;
  onSwitchView?: () => void;
};

export const ProfileAvatar = (props: ProfileAvatarProps) => {
  return (
    <Flex className={classes.root}>
      <Avatar name={props.mode} onItemClick={() => props.onSwitchView?.()} />
      <Button
        type="primary"
        shape="circle"
        icon={<SwapOutlined />}
        className={classes.swap}
        onClick={() => props.onSwitchView?.()}
      />
    </Flex>
  );
};
