import { masterModel, MasterStatus } from '@/entities/master';
import { formatUserFullName, UserAvatar } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { PageLayout } from '@/shared/ui/page-layout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function Page() {
  const viewer = viewerModel.useViewer();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { masters, loading } = masterModel.useMasters(viewer.gymer?.gymer_id);

  return (
    <PageLayout loading={loading}>
      <Flex height="100%" style={{ overflow: 'auto' }}>
        <List
          items={masters}
          itemKey="master_id"
          emptyText={loading ? '' : t('profile.noMasters')}
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
