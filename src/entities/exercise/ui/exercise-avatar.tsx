import { Avatar } from 'antd';
import { ReactNode } from 'react';

type ExerciseAvatarProps = {
  size?: number;
  icon?: ReactNode;
};

export const ExerciseAvatar = ({ size = 40, icon }: ExerciseAvatarProps) => {
  return (
    <Avatar
      size={size}
      style={{
        flexShrink: 0,
        backgroundColor: '#f0f0f0',
        color: '#888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      icon={icon}
    />
  );
};
