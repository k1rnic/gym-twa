import { gymmerModel } from '@/entities/gymmer';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, MastersGymer } from '@/shared/api';
import { useNavigateBack } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Page() {
  const goBack = useNavigateBack();
  const navigate = useNavigate();

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
    <PageLayout onBackClick={goBack} loading={gymmerApi.loading || isBreaking}>
      <Flex style={{ height: '100%', overflow: 'auto' }}>
        <List
          items={gymmers}
          itemKey="gymer_id"
          emptyText={gymmerApi.loading ? '' : 'Учеников пока нет'}
          variant="contained"
          renderItem={(g) => (
            <ListItem
              avatar={<UserAvatar size="large" user={g} />}
              header={formatUserFullName(g)}
              nav
              onClick={() => navigate(`/profile/gymmers/${g.gymer_id}`)}
            />
          )}
        />
      </Flex>
    </PageLayout>
  );
}
