import { formatUserFullName, UserTgLink } from '@/entities/user';
import { User } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Typography } from 'antd';

export type ProfileNameProps = {
  user: User;
  readOnly?: boolean;
};

export const ProfileName = ({ user, readOnly = false }: ProfileNameProps) => {
  const { token } = useTheme();

  return (
    <Flex
      vertical
      style={{
        position: 'absolute',
        bottom: token.paddingLG,
        left: token.paddingLG,
        zIndex: 1,
      }}
    >
      <Typography>{formatUserFullName(user)}</Typography>
      <UserTgLink readOnly={readOnly} user={user} />
    </Flex>
  );
};
