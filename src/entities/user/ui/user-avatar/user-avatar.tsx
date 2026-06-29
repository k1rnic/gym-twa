import { User } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Avatar, Typography } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';
import { useMemo } from 'react';
import { formatUserFullName, getDefaultUserPhoto } from '../../lib';

type UserAvatarProps = {
  user: Pick<
    User,
    'first_name' | 'last_name' | 'username' | 'photos' | 'photo'
  >;
  size?: AvatarSize;
  compact?: boolean;
  vertical?: boolean;
};

export const UserAvatar = ({
  size = 'default',
  user,
  compact = true,
  vertical = false,
}: UserAvatarProps) => {
  const { token } = useTheme();

  const src = useMemo(() => getDefaultUserPhoto(user), [user]);

  return (
    <Flex gap={8} vertical={vertical} align="center">
      <Avatar
        shape="circle"
        size={size}
        src={src}
        style={{ backgroundColor: token.colorSplit }}
      />
      <Typography.Text hidden={compact}>
        {formatUserFullName(user) || user.username}
      </Typography.Text>
    </Flex>
  );
};
