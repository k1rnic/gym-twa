import { mapTgUserToViewer, viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api-v2';
import { TgWebAppData, useTelegramData } from '@/shared/lib/telegram';
import { isAxiosError } from 'axios';
import { ComponentType, useEffect } from 'react';

export const withAuth =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) => {
    const { user: tgUser } = useTelegramData();
    const [viewer, setViewer] = viewerModel.useViewerContext();

    const register = async (user: Required<TgWebAppData>['user']) => {
      const created = await Api.user.addUser(mapTgUserToViewer(user));
      if (created) {
        setViewer(created);
      }
    };

    const auth = async (user: Required<TgWebAppData>['user']) => {
      try {
        const existed = await Api.user.getUserDataByTelegramId(user.id);
        if (existed) {
          setViewer(existed);
        }
      } catch (e) {
        if (isAxiosError(e) && e.status === 404) {
          register(user);
        }
      }
    };

    useEffect(() => {
      if (tgUser?.id) {
        auth(tgUser);
      }
    }, [tgUser?.id]);

    return viewer ? (
      <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
    ) : null;
  };
