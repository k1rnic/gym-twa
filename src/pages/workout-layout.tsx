import { formatUserDisplayName } from '@/entities/user';
import { viewerModel } from '@/entities/viewer';
import { Api, MastersGymer, TaskGroupStatus } from '@/shared/api';
import { useMatchExact } from '@/shared/lib/router';
import { AvatarList, AvatarListItem } from '@/shared/ui/avatar';
import { Flex } from '@/shared/ui/flex';
import { Divider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

const Page = () => {
  const { master, gymer } = viewerModel.useViewer();
  const { pathname } = useLocation();

  const isIndex = useMatchExact();

  const [masterGymmers, setMasterGymmers] = useState<MastersGymer[]>([]);

  const navigate = useNavigate();

  const items = useMemo(
    () =>
      masterGymmers.map<AvatarListItem>((gymmer) => ({
        id: gymmer.gymer_id,
        name: gymmer.username || formatUserDisplayName(gymmer),
        src: gymmer.photo!,
      })),
    [masterGymmers],
  );

  const selectedItem = useMemo(
    () => items.find((i) => pathname.startsWith(`/workouts/${i.id}`))?.id,
    [items, pathname],
  );

  const navigateToGymmer = (g: AvatarListItem) => {
    navigate(`${g.id}/${TaskGroupStatus.Planned}`);
  };

  useEffect(() => {
    Api.user
      .getListOfMastersGymer(Number(master?.master_id))
      .then(setMasterGymmers);
  }, [master?.master_id]);

  useEffect(() => {
    if (isIndex) {
      navigate(`${gymer?.gymer_id}/${TaskGroupStatus.Planned}`);
    }
  }, [isIndex, gymer]);

  return (
    <Flex height="100%" gap="small" style={{ overflow: 'hidden' }}>
      <AvatarList
        items={items}
        selected={selectedItem}
        pinned={gymer?.gymer_id}
        onClick={navigateToGymmer}
      />
      <Divider />

      <Outlet />
    </Flex>
  );
};

export default Page;
