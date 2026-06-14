import { User } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';
import { useMemo } from 'react';
import { getDefaultUserPhoto } from '../../lib';

type UserAvatarProps = {
  user: Pick<User, 'photo' | 'photos'>;
  size?: AvatarSize;
};

export const UserAvatar = ({ size = 'default', user }: UserAvatarProps) => {
  const { token } = useTheme();

  const src = useMemo(() => getDefaultUserPhoto(user), [user]);

  return (
    <Avatar
      shape="circle"
      size={size}
      src={src}
      style={{ backgroundColor: token.colorSplit }}
    />
  );
};
