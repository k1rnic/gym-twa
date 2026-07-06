import { gymmerModel } from '@/entities/gymmer';
import { viewerModel } from '@/entities/viewer';
import { Api, type User } from '@/shared/api';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { ProfileHero, ProfileName } from '@/widgets/user-profile';
import { Button, Empty, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router';

export default function Page() {
  const { token } = useTheme();
  const { gymerId } = useParams();
  const location = useLocation();

  const viewer = viewerModel.useViewer();
  const { gymmers, refresh, loading } = gymmerModel.useGymmers(
    viewer.master?.master_id,
  );
  const [actionLoading, setActionLoading] = useState(false);

  const gymmer = useMemo(
    () => gymmers.find((item) => item.gymer_id === Number(gymerId)),
    [gymmers, gymerId],
  );

  const senderUser = useMemo(() => {
    const state = location.state as { senderUser?: User } | null;
    return state?.senderUser;
  }, [location.state]);

  const detailsUser = gymmer ?? senderUser;
  const isAttached = Boolean(gymmer);

  const handleBreak = useCallback(async () => {
    if (!gymmer) return;
    setActionLoading(true);

    try {
      await Api.user.masterGymerBreak({
        gymer_id: gymmer.gymer_id,
        master_id: viewer.master!.master_id!,
      });
      message.success('Успешно откреплено');
      await refresh();
    } finally {
      setActionLoading(false);
    }
  }, [gymmer, refresh, viewer.master]);

  if (!detailsUser && !loading) {
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
        {gymmer && (
          <Flex style={{ position: 'relative' }}>
            <ProfileHero user={gymmer} />
            <ProfileName user={gymmer} />
          </Flex>
        )}

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
