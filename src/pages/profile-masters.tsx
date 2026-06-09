import { masterModel, MasterStatus } from '@/entities/master';
import { viewerModel } from '@/entities/viewer';
import { useNavigateBack } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { SharedList, SharedListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { Avatar, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

const { Text } = Typography;

const formatName = (
  first?: string | null,
  last?: string | null,
  username?: string | null,
) => {
  const fio = `${first ?? ''} ${last ?? ''}`.trim();
  return fio || username || 'Без имени';
};

export default function Page() {
  const viewer = viewerModel.useViewer();
  const navigate = useNavigate();
  const goBack = useNavigateBack();

  const { masters, loading } = masterModel.useMasters(viewer.gymer?.gymer_id);

  const data = useMemo(
    () =>
      masters.map((m) => ({
        ...m,
        displayName: formatName(m.first_name, m.last_name, m.username),
        avatar: m.photos?.[0],
      })),
    [masters],
  );

  return (
    <PageLayout title="Тренеры" onBackClick={goBack} loading={loading}>
      <Flex height="100%" style={{ overflow: 'auto' }}>
        <SharedList
          items={data}
          itemKey="master_id"
          emptyText={loading ? '' : 'Тренеров пока нет'}
          variant="contained"
          renderItem={(item) => (
            <SharedListItem
              avatar={
                <Avatar
                  size={64}
                  style={{ backgroundColor: '#f0f0f0' }}
                  src={item.avatar}
                />
              }
              header={<Text strong>{item.displayName}</Text>}
              description={<MasterStatus status={item.status} />}
              nav
              onClick={() => navigate(`/profile/masters/${item.master_id}`)}
            />
          )}
        />
      </Flex>
    </PageLayout>
  );
}
