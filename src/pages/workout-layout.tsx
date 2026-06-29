import { gymmerModel } from '@/entities/gymmer';
import {
  formatUserFullName,
  getDefaultUserPhoto,
  UserAvatarList,
  UserAvatarListItem,
} from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { TaskGroupStatus } from '@/shared/api';
import { useMatchExact } from '@/shared/lib/router';
import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

const Page = () => {
  const { master, gymer } = viewerModel.useViewer();
  const { pathname } = useLocation();

  const isIndex = useMatchExact();

  const { gymmers: masterGymmers, loading } = gymmerModel.useGymmers(
    Number(master?.master_id),
  );

  const navigate = useNavigate();

  const items = useMemo(
    () =>
      masterGymmers
        .map<UserAvatarListItem>((g) => ({
          id: g.gymer_id,
          name: formatUserFullName(g) ?? g.username,
          src: getDefaultUserPhoto(g),
        }))
        .sort((a, b) =>
          a.id === gymer?.gymer_id ? -1 : b.id === gymer?.gymer_id ? -1 : 1,
        ),
    [masterGymmers, gymer?.gymer_id],
  );

  const selectedItem = useMemo(
    () => items.find((i) => pathname.startsWith(`/workouts/${i.id}`))?.id,
    [items, pathname],
  );

  const navigateToGymmer = (g: UserAvatarListItem) => {
    navigate(`${g.id}/${TaskGroupStatus.Planned}`);
  };

  useEffect(() => {
    if (isIndex) {
      navigate(`${gymer?.gymer_id}/${TaskGroupStatus.Planned}`);
    }
  }, [isIndex, gymer]);

  return (
    <PageLayout>
      {loading ? (
        <Spin fullscreen />
      ) : (
        <Flex height="100%" gap="small" style={{ overflow: 'hidden' }}>
          <UserAvatarList
            items={items}
            selected={selectedItem}
            onClick={navigateToGymmer}
          />

          <Outlet />
        </Flex>
      )}
    </PageLayout>
  );
};

export default Page;
