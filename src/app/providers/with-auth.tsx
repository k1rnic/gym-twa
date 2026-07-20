import { mapTgUserToViewer, viewerModel } from '@/entities/viewer';
import { PolicyDrawer } from '@/features/policy-consent';
import { Api } from '@/shared/api';
import { TgWebAppData, useTelegramData } from '@/shared/lib/telegram';
import { PageSpinner } from '@/shared/ui/page-spinner';
import { isAxiosError } from 'axios';
import { ComponentType, useEffect, useState } from 'react';

export const withAuth =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) => {
    const { user: tgUser } = useTelegramData();
    const [viewer, setViewer] = viewerModel.useViewerContext();
    const [pendingUser, setPendingUser] = useState<
      Required<TgWebAppData>['user'] | null
    >(null);
    const [consentOpen, setConsentOpen] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    const register = async (user: Required<TgWebAppData>['user']) => {
      const created = await Api.user.addUser(mapTgUserToViewer(user));
      if (created) {
        setViewer(created);
      }
    };

    const auth = async (user: Required<TgWebAppData>['user']) => {
      try {
        const existed = await Api.user.getUserDataByTelegramId(user.id);
        setAuthLoading(true);
        if (existed) {
          setViewer(existed);
        }
      } catch (e) {
        if (isAxiosError(e) && e.status === 404) {
          setPendingUser(user);
          setConsentOpen(true);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    const handleAccept = async () => {
      if (!pendingUser) {
        return;
      }

      setRegistering(true);
      try {
        await register(pendingUser);
        setConsentOpen(false);
        setPendingUser(null);
      } finally {
        setRegistering(false);
      }
    };

    useEffect(() => {
      if (tgUser?.id) {
        auth(tgUser);
      }
    }, [tgUser?.id]);

    const spinning =
      Boolean(tgUser?.id) &&
      (registering || (!viewer && !consentOpen) || authLoading);

    return (
      <>
        <PageSpinner spinning={spinning} />
        <PolicyDrawer
          mode="consent"
          open={consentOpen}
          loading={registering}
          onAccept={handleAccept}
        />
        {viewer ? (
          <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
        ) : null}
      </>
    );
  };
