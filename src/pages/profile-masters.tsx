import { masterModel, MasterStatus } from '@/entities/master';
import { viewerModel } from '@/entities/viewer';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';
import { Flex } from '@/shared/ui/flex';
import { APP_TOOLBAR_HEIGHT } from '@/widgets/app-toolbar';
import { RightOutlined } from '@ant-design/icons';
import { Avatar, List, Typography } from 'antd';
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
    <Flex gap={24} height="100%" style={{ overflow: 'hidden' }}>
      <Breadcrumbs
        items={[{ path: '/profile', title: 'Профиль' }, { title: 'Тренеры' }]}
      />

      <Flex height="100%" style={{ overflow: 'auto' }}>
        <List
          loading={loading}
          dataSource={data}
          locale={{ emptyText: 'Тренеров пока нет' }}
          renderItem={(item, idx) => (
            <List.Item
              style={{
                cursor: 'pointer',
                marginBottom: idx === data.length - 1 ? APP_TOOLBAR_HEIGHT : 0,
              }}
              onClick={() => navigate(`/profile/masters/${item.master_id}`)}
            >
              <Flex vertical={false} width="100%">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={64}
                      style={{ backgroundColor: '#f0f0f0' }}
                      src={item.avatar}
                    />
                  }
                  title={<Text strong>{item.displayName}</Text>}
                  description={<MasterStatus status={item.status} />}
                />

                <RightOutlined style={{ marginLeft: 8 }} />
              </Flex>
            </List.Item>
          )}
        />
      </Flex>
    </Flex>
  );
}
