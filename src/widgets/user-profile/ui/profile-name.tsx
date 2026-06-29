import { formatUserFullName, UserTgLink } from '@/entities/user';
import { User } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Typography } from 'antd';

export type ProfileNameProps = {
  user: Omit<User, 'user_id'>;
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
      <Typography.Title style={{ margin: 0 }} level={2}>
        {formatUserFullName(user)}
      </Typography.Title>
      <UserTgLink
        readOnly={readOnly}
        user={user}
        style={{ fontSize: token.fontSizeHeading5 }}
      />
    </Flex>
  );
};
