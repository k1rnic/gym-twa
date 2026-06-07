import { gymmerModel } from '@/entities/gymmer';
import { formatUserDisplayName } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, MastersGymer } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { Avatar, Button, List, message } from 'antd';
import { useMemo, useState } from 'react';

export default function Page() {
  const goBack = useNavigateBack();

  const viewer = viewerModel.useViewer();
  const [isBreaking, setIsBreaking] = useState(false);

  const gymmerApi = gymmerModel.useGymmers(viewer.master?.master_id);
  const gymmers = useMemo(
    () => gymmerApi.gymmers.filter((g) => g.user_id !== viewer.user_id),
    [gymmerApi.gymmers, viewer.user_id],
  );

  const handleBreak = async (gymmer: MastersGymer) => {
    setIsBreaking(true);
    try {
      await Api.user.masterGymerBreak({
        gymer_id: gymmer.gymer_id,
        master_id: viewer.master!.master_id!,
      });
      message.success('Успешно отклонено');
      gymmerApi.refresh();
    } finally {
      setIsBreaking(false);
    }
  };

  return (
    <PageLayout
      title="Мои ученики"
      onBackClick={goBack}
      loading={gymmerApi.loading || isBreaking}
    >
      <Flex style={{ height: '100%', overflow: 'auto' }}>
        <List
          dataSource={gymmers}
          locale={{ emptyText: gymmerApi.loading ? '' : 'Учеников пока нет' }}
          renderItem={(gymmer) => (
            <List.Item
              style={{ alignItems: 'flex-start' }}
              styles={{ actions: { marginLeft: 0 } }}
              actions={[
                <Button
                  key="reject"
                  danger
                  size="small"
                  onClick={() => handleBreak(gymmer)}
                >
                  Открепить
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={64}
                    style={{ backgroundColor: '#f0f0f0' }}
                    src={gymmer.photo}
                  />
                }
                title={formatUserDisplayName(gymmer)}
              />
            </List.Item>
          )}
        />
      </Flex>
    </PageLayout>
  );
}
