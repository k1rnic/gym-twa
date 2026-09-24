import { viewerModel } from '@/entities/viewer';
import { PolicyDrawer } from '@/features/policy-consent';
import { authService } from '@/shared/lib/auth/auth-service';
import { Flex } from '@/shared/ui/flex';
import { PageSpinner } from '@/shared/ui/page-spinner';
import { Empty } from 'antd';
import { ComponentType, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';

export const withAuth =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) => {
    const { t } = useTranslation();
    const [viewer] = viewerModel.useViewerContext();
    const { revalidate } = useRevalidator();
    const auth = useSyncExternalStore(
      authService.subscribe,
      authService.getSnapshot,
      authService.getSnapshot,
    );

    const handleAccept = async () => {
      try {
        await authService.completeSignup();
        revalidate();
      } catch (error) {
        console.error('Failed to register user', error);
      }
    };

    const authError = auth.status === 'forbidden';
    const consentOpen = auth.status === 'consent_required';
    const spinning =
      auth.status === 'authenticating' || (!viewer && !consentOpen);

    if (authError) {
      return (
        <Flex height="100%" width="100%" align="center" justify="center">
          <Empty
            description={t('errors.authForbidden')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Flex>
      );
    }

    return (
      <>
        <PageSpinner spinning={spinning} />
        <PolicyDrawer
          mode="consent"
          open={consentOpen}
          loading={auth.status === 'authenticating'}
          onAccept={handleAccept}
        />
        {viewer ? (
          <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
        ) : null}
      </>
    );
  };
