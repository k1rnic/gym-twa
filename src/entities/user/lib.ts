import { User } from '@/shared/api';

export const formatUserDisplayName = (
  user: Pick<User, 'first_name' | 'last_name'>,
) => {
  return (
    `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ?? 'Без имени'
  );
};
