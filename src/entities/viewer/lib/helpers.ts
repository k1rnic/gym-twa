import type { UserIn } from '@/shared/api-v2';
import { TgWebAppData } from '@/shared/lib/telegram';

export const mapTgUserToViewer = (
  user: Required<TgWebAppData>['user'],
): UserIn => ({
  telegram_id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  username: user.username,
  photo: user.photo_url,
});
