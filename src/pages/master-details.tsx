import { masterModel, MasterStatus } from '@/entities/master';
import { viewerModel } from '@/entities/viewer';
import { Api, GymerMasterStatus } from '@/shared/api';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Flex } from '@/shared/ui/flex';
import { Button, Card, Empty, message, Space, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { formatUserDisplayName, UserTgLink } from '@/entities/user';

import { AvatarPreview } from '@/shared/ui/avatar';

const { Title, Paragraph, Text } = Typography;

export default function Page() {
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
          <Button danger block onClick={handleBreak} loading={actionLoading}>
            Открепиться
          </Button>
        );
      case GymerMasterStatus.AcceptsRequests:
        return (
          <Button
            type="primary"
            block
            onClick={handleSendRequest}
            loading={actionLoading}
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
      <Flex height="100%" width="100%" align="center" justify="center">
        <Empty
          description="Тренер не найден"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Flex>
    );
  }

  return (
    <Flex gap="small" style={{ overflow: 'auto', height: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Breadcrumbs
          items={[
            { path: '/profile', title: 'Профиль' },
            { path: '/masters', title: 'Тренеры' },
            { title: 'Информация' },
          ]}
        />

        <Card loading={loading}>
          <Space align="start" size="large">
            <AvatarPreview
              photos={master?.photos ?? []}
              preview={{ toolbarRender: () => <></> }}
            />

            <Space direction="vertical">
              {master && (
                <Space direction="vertical">
                  <Title level={3} style={{ margin: 0 }}>
                    {formatUserDisplayName(master)}
                  </Title>

                  <UserTgLink user={master} />
                </Space>
              )}

              <MasterStatus status={master?.status} />

              <Paragraph>
                {master?.description || 'Описание отсутствует'}
              </Paragraph>
            </Space>
          </Space>
        </Card>

        {renderActions()}
      </Space>
    </Flex>
  );
}
