import { gymmerModel } from '@/entities/gymmer';
import { formatUserDisplayName } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, type User } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { AvatarPreview } from '@/shared/ui/avatar';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { Button, Card, Empty, message, Space, Typography } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router';

const { Title, Paragraph } = Typography;

export default function Page() {
  const { gymerId } = useParams();
  const location = useLocation();
  const goBack = useNavigateBack();

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
      <PageLayout title="Информация" onBackClick={goBack} loading={loading}>
        <Flex height="100%" width="100%" align="center" justify="center">
          <Empty
            description="Ученик не найден"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Flex>
      </PageLayout>
    );
  }

  const photos = gymmer
    ? gymmer.photo
      ? [gymmer.photo]
      : []
    : senderUser?.photos ?? (senderUser?.photo ? [senderUser.photo] : []);

  return (
    <PageLayout title="Информация" onBackClick={goBack} loading={loading}>
      <Flex gap="small" style={{ overflow: 'auto', height: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card loading={loading}>
            <Space align="start" size="large">
              <AvatarPreview
                photos={photos}
                preview={{ toolbarRender: () => <></> }}
              />

              <Space direction="vertical">
                {detailsUser && (
                  <Space direction="vertical">
                    <Title level={3} style={{ margin: 0 }}>
                      {formatUserDisplayName(detailsUser)}
                    </Title>

                    <Paragraph>
                      {detailsUser.username
                        ? `@${detailsUser.username}`
                        : 'Псевдоним отсутствует'}
                    </Paragraph>
                  </Space>
                )}

                <Paragraph>
                  {isAttached
                    ? 'Ученик у вас в списке'
                    : 'Ученик пока не прикреплён'}
                </Paragraph>
              </Space>
            </Space>
          </Card>

          {isAttached && (
            <Button danger block loading={actionLoading} onClick={handleBreak}>
              Открепить
            </Button>
          )}
        </Space>
      </Flex>
    </PageLayout>
  );
}
