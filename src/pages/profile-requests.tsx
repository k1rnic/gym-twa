import { masterModel } from '@/entities/master';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, NotificationUserResponse } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { Button, message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const { Paragraph } = Typography;

export default function Page() {
  const navigate = useNavigate();
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
    <PageLayout loading={loading}>
      <Flex style={{ height: '100%', overflow: 'auto' }}>
        <List
          items={requests}
          itemKey="notification_id"
          emptyText={loading ? '' : 'Заявок пока нет'}
          variant="contained"
          renderItem={(item) => {
            const gymerId = item.sender_user?.gymer?.gymer_id;

            return (
              <ListItem
                nav
                onClick={() => navigate(`/profile/gymmers/${gymerId}`)}
                avatar={
                  item.sender_user && (
                    <UserAvatar size="large" user={item.sender_user} />
                  )
                }
                header={
                  item.sender_user
                    ? formatUserFullName(item.sender_user)
                    : String(item.sender)
                }
                description={
                  <Paragraph style={{ margin: 0 }}>
                    Пользователь{' '}
                    <b>
                      {item.sender_user
                        ? formatUserFullName(item.sender_user)
                        : item.sender}
                    </b>{' '}
                    хочет прикрепиться к вам
                  </Paragraph>
                }
                actions={[
                  <Button
                    key="accept"
                    type="primary"
                    size="small"
                    loading={actionId === item.notification_id}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRequest(item.notification_id, true);
                    }}
                  >
                    Принять
                  </Button>,
                  <Button
                    key="reject"
                    danger
                    type="primary"
                    size="small"
                    loading={actionId === item.notification_id}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRequest(item.notification_id, false);
                    }}
                  >
                    Отклонить
                  </Button>,
                ]}
              />
            );
          }}
        />
      </Flex>
    </PageLayout>
  );
}
