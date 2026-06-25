import { masterModel, MasterStatus } from '@/entities/master';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { useNavigateBack } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { Typography } from 'antd';
import { useNavigate } from 'react-router';

const { Text } = Typography;

export default function Page() {
  const viewer = viewerModel.useViewer();
  const navigate = useNavigate();
  const goBack = useNavigateBack();

  const { masters, loading } = masterModel.useMasters(viewer.gymer?.gymer_id);

  return (
    <PageLayout title="Тренеры" onBackClick={goBack} loading={loading}>
      <Flex height="100%" style={{ overflow: 'auto' }}>
        <List
          items={masters}
          itemKey="master_id"
          emptyText={loading ? '' : 'Тренеров пока нет'}
          variant="contained"
          renderItem={(m) => (
            <ListItem
              avatar={m && <UserAvatar size="large" user={m} />}
              header={formatUserFullName(m) || m.username}
              description={<MasterStatus status={m.status} />}
              nav
              onClick={() => navigate(`/profile/masters/${m.master_id}`)}
            />
          )}
        />
      </Flex>
    </PageLayout>
  );
}
