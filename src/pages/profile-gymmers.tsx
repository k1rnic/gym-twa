import { gymmerModel } from '@/entities/gymmer';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function Page() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const viewer = viewerModel.useViewer();

  const gymmerApi = gymmerModel.useGymmers(viewer.master?.master_id);
  const gymmers = useMemo(
    () => gymmerApi.gymmers.filter((g) => g.user_id !== viewer.user_id),
    [gymmerApi.gymmers, viewer.user_id],
  );

  return (
    <PageLayout loading={gymmerApi.loading}>
      <Flex style={{ height: '100%', overflow: 'auto' }}>
        <List
          items={gymmers}
          itemKey="gymer_id"
          emptyText={gymmerApi.loading ? '' : t('profile.noGymmers')}
          variant="contained"
          renderItem={(g) => (
            <ListItem
              avatar={<UserAvatar size="large" user={g} />}
              header={formatUserFullName(g)}
              nav
              onClick={() => navigate(`/profile/gymmers/${g.user_id}`)}
            />
          )}
        />
      </Flex>
    </PageLayout>
  );
}
