import { masterModel } from '@/entities/master';
import { formatUserDisplayName } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, NotificationUserResponse } from '@/shared/api';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Flex } from '@/shared/ui/flex';
import { APP_TOOLBAR_HEIGHT } from '@/widgets/app-toolbar';
import { Avatar, Button, List, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';

const { Paragraph } = Typography;

export default function Page() {
  const viewer = viewerModel.useViewer();

  const { refresh: refreshMasters } = masterModel.useMasters(
    viewer.gymer?.gymer_id,
  );

  const [requests, setRequests] = useState<NotificationUserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await Api.notification.recipientNotification(
        viewer.user_id,
        { is_read: false },
      );
      setRequests(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleRequest = async (notificationId: number, accept: boolean) => {
    setActionId(notificationId);
    try {
      await Api.notification.closeJoinRequest(notificationId, {
        accept_flg: accept,
      });
      message.success(accept ? 'Заявка принята' : 'Заявка отклонена');
      await loadRequests();
      await refreshMasters();
    } finally {
      setActionId(null);
    }
  };

  return (
    <Flex gap="small" style={{ height: '100%', overflow: 'hidden' }}>
      <Breadcrumbs
        items={[
          { path: '/profile', title: 'Профиль' },
          { title: 'Заявки на прикрепление' },
        ]}
      />

      <Flex style={{ height: '100%', overflow: 'auto' }}>
        <List
          loading={loading}
          dataSource={requests}
          locale={{ emptyText: 'Заявок пока нет' }}
          itemLayout="vertical"
          renderItem={(item, idx) => (
            <List.Item
              styles={{ actions: { marginLeft: 0 } }}
              style={{
                marginBottom:
                  idx === requests.length - 1 ? APP_TOOLBAR_HEIGHT : 0,
              }}
              actions={[
                <Button
                  key="accept"
                  type="primary"
                  size="small"
                  loading={actionId === item.notification_id}
                  onClick={() => handleRequest(item.notification_id, true)}
                >
                  Принять
                </Button>,
                <Button
                  key="reject"
                  danger
                  size="small"
                  loading={actionId === item.notification_id}
                  onClick={() => handleRequest(item.notification_id, false)}
                >
                  Отклонить
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={64}
                    style={{ backgroundColor: '#f0f0f0' }}
                    src={item.sender_user?.photos?.[0]}
                  />
                }
                title="Заявка на прикрепление"
                description={
                  <Space direction="vertical">
                    <Paragraph style={{ margin: 0 }}>
                      Пользователь{' '}
                      <b>
                        {item.sender_user
                          ? formatUserDisplayName(item.sender_user)
                          : item.sender}
                      </b>{' '}
                      хочет прикрепиться к вам
                    </Paragraph>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Flex>
    </Flex>
  );
}
