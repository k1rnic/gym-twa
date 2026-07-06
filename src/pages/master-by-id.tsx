import { masterModel } from '@/entities/master';
import { viewerModel } from '@/entities/viewer';
import { Api, GymerMasterStatus } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { Button, Empty, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { useTheme } from '@/shared/lib/theme';
import {
  ProfileDescription,
  ProfileHero,
  ProfileName,
} from '@/widgets/user-profile';

export default function Page() {
  const { token } = useTheme();
  const { masterId } = useParams();

  const viewer = viewerModel.useViewer();

  const { masters, refresh, loading } = masterModel.useMasters(
    viewer.gymer?.gymer_id,
  );
  const [actionLoading, setActionLoading] = useState(false);

  const master = useMemo(
    () => masters.find((m) => m.master_id === Number(masterId)),
    [masterId, masters],
  );

  const handleSendRequest = async () => {
    if (!master) return;
    setActionLoading(true);
    try {
      await Api.notification.joinMasterRequest({
        sender: viewer.user_id,
        recipient: master.user_id!,
      });
      message.success('Заявка отправлена');
      await refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreak = async () => {
    if (!master) return;
    setActionLoading(true);
    try {
      await Api.user.masterGymerBreak({
        gymer_id: viewer.gymer!.gymer_id,
        master_id: master.master_id!,
      });
      message.success('Вы открепились от тренера');
      await refresh();
    } finally {
      setActionLoading(false);
    }
  };

  const renderActions = useCallback(() => {
    switch (master?.status) {
      case GymerMasterStatus.CurrentMaster:
        return (
          <Button
            danger
            block
            type="primary"
            onClick={handleBreak}
            loading={actionLoading}
          >
            Открепиться
          </Button>
        );
      case GymerMasterStatus.AcceptsRequests:
        return (
          <Button
            block
            type="primary"
            onClick={handleSendRequest}
            loading={actionLoading}
            style={{ backgroundColor: token.colorInfo }}
          >
            Отправить заявку на прикрепление
          </Button>
        );
      default:
        return null;
    }
  }, [master?.status, actionLoading]);

  if (!master && !loading) {
    return (
      <PageLayout loading={loading}>
        <Flex height="100%" width="100%" align="center" justify="center">
          <Empty
            description="Тренер не найден"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout loading={loading} contentStyle={{ padding: 0 }}>
      <Flex height="100%" style={{ overflowY: 'auto' }}>
        {master && (
          <Flex style={{ position: 'relative' }}>
            <ProfileHero user={master} />
            <ProfileName user={master} />
          </Flex>
        )}

        <Flex p={token.paddingSM} gap={token.paddingSM}>
          <ProfileDescription
            value={master?.description || 'Описание отсутствует'}
            disabled
          />
        </Flex>

        <Flex flex={1} p={token.paddingSM}>
          {renderActions()}
        </Flex>
      </Flex>
    </PageLayout>
  );
}
