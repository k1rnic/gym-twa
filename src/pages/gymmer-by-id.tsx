import { gymmerModel } from '@/entities/gymmer';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { ProfileHero, ProfileName } from '@/widgets/user-profile';
import { Button, Empty, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { Route } from './+types/gymmer-by-id';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.user.getUserDataByUserId(+params.userId);
};

export default function Page({ loaderData: user }: Route.ComponentProps) {
  const { token } = useTheme();

  const viewer = viewerModel.useViewer();
  const {
    gymmers: masterGymmers,
    refresh,
    loading,
  } = gymmerModel.useGymmers(viewer.master?.master_id);
  const [actionLoading, setActionLoading] = useState(false);

  const masterGymmer = useMemo(
    () =>
      masterGymmers.find(
        (item) => item.gymer_id === Number(user.gymer?.gymer_id),
      ),
    [masterGymmers, user.gymer?.gymer_id],
  );

  const isAttached = Boolean(masterGymmer);

  const handleBreak = useCallback(async () => {
    if (!masterGymmer) return;
    setActionLoading(true);

    try {
      await Api.user.masterGymerBreak({
        gymer_id: masterGymmer.gymer_id,
        master_id: viewer.master!.master_id!,
      });
      message.success('Успешно откреплено');
      await refresh();
    } finally {
      setActionLoading(false);
    }
  }, [masterGymmer, refresh, viewer.master]);

  if (!user && !loading) {
    return (
      <PageLayout title="Информация" loading={loading}>
        <Flex height="100%" width="100%" align="center" justify="center">
          <Empty
            description="Ученик не найден"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout loading={loading} contentStyle={{ padding: 0 }}>
      <Flex height="100%" gap={token.paddingSM} style={{ overflowY: 'auto' }}>
        <Flex style={{ position: 'relative' }}>
          <ProfileHero user={user} />
          <ProfileName user={user} />
        </Flex>

        <Flex flex={1} p={token.paddingSM}>
          {isAttached && (
            <Button
              danger
              block
              type="primary"
              size="middle"
              loading={actionLoading}
              onClick={handleBreak}
            >
              Открепить
            </Button>
          )}
        </Flex>
      </Flex>
    </PageLayout>
  );
}
