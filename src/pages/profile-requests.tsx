import { masterModel } from '@/entities/master';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, NotificationUserResponse } from '@/shared/api';
import { notify } from '@/shared/lib/notification';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const { Paragraph } = Typography;

export default function Page() {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();
  const { t } = useTranslation();

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
      notify.success(
        accept ? t('profile.requestAccepted') : t('profile.requestRejected'),
      );
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
          emptyText={loading ? '' : t('profile.noRequests')}
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
                    {t('common.user')}{' '}
                    <b>
                      {item.sender_user
                        ? formatUserFullName(item.sender_user)
                        : item.sender}
                    </b>{' '}
                    {t('profile.requestMessage')}
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
                    {t('common.accept')}
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
                    {t('common.reject')}
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
