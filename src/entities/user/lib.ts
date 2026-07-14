import { User } from '@/shared/api';
import i18next from 'i18next';

export const getDefaultUserPhoto = (user: Pick<User, 'photo' | 'photos'>) => {
  return user.photo || user.photos?.at(0);
};

export const formatUserFullName = (
  user: Pick<User, 'first_name' | 'last_name'>,
) => {
  return (
    `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ??
    i18next.t('common.unknownName')
  );
};
