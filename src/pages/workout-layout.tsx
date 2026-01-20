import { Route } from '.react-router/types/src/pages/+types/workout-layout';
import { viewerModel } from '@/entities/viewer';
import { Api, TaskGroupStatus } from '@/shared/api';
import { AvatarList, AvatarListItem } from '@/shared/ui/avatar';
import { Flex } from '@/shared/ui/flex';
import { Divider } from 'antd';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

export const clientLoader = async (props: Route.ClientLoaderArgs) => {
  return Api.user.getListOfMastersGymer(Number(props.params.mId));
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  const { master, gymer } = viewerModel.useViewer();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const items = useMemo(
    () =>
      loaderData.map<AvatarListItem>((gymmer) => ({
        id: gymmer.gymer_id,
        name: gymmer.username,
        src: gymmer.photo!,
      })),
    [loaderData],
  );

  const selectedItem = useMemo(
    () =>
      items.find((i) =>
        pathname.startsWith(`/workouts/${master?.master_id}/${i.id}`),
      )?.id,
    [items, pathname, master?.master_id],
  );

  const navigateToGymmer = (g: AvatarListItem) => {
    navigate(`${g.id}/${TaskGroupStatus.Planned}`);
  };

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
