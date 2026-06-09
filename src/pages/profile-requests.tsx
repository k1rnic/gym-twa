import { masterModel } from '@/entities/master';
import { formatUserDisplayName } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, NotificationUserResponse } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { SharedList, SharedListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { Avatar, Button, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const { Paragraph } = Typography;

export default function Page() {
  const goBack = useNavigateBack();

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

  const navigate = useNavigate();

  return (
    <PageLayout
      title="Заявки на прикрепление"
      onBackClick={goBack}
      loading={loading}
    >
      <Flex style={{ height: '100%', overflow: 'auto' }}>
        <SharedList
          items={requests}
          itemKey="notification_id"
          emptyText={loading ? '' : 'Заявок пока нет'}
          variant="contained"
          renderItem={(item) => {
            const gymerId = item.sender_user?.gymer?.gymer_id;

            return (
              <SharedListItem
                avatar={
                  <Avatar
                    size={64}
                    style={{ backgroundColor: '#f0f0f0' }}
                    src={
                      item.sender_user?.photos?.[0] ?? item.sender_user?.photo
                    }
                  />
                }
                header={
                  item.sender_user
                    ? formatUserDisplayName(item.sender_user)
                    : String(item.sender)
                }
                description={
                  <Paragraph style={{ margin: 0 }}>
                    Пользователь{' '}
                    <b>
                      {item.sender_user
                        ? formatUserDisplayName(item.sender_user)
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
                nav={Boolean(gymerId)}
                onClick={() =>
                  gymerId &&
                  navigate(`/profile/gymmers/${gymerId}`, {
                    state: { senderUser: item.sender_user },
                  })
                }
              />
            );
          }}
        />
      </Flex>
    </PageLayout>
  );
}
