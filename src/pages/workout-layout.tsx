import { Route } from '.react-router/types/src/pages/+types/workout-layout';
import { viewerModel } from '@/entities/viewer';
import { Api, TaskGroupStatus } from '@/shared/api';
import { useMatchExact } from '@/shared/lib/router';
import { AvatarList, AvatarListItem } from '@/shared/ui/avatar-list';
import { Flex } from '@/shared/ui/flex';
import { Divider } from 'antd';
import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router';

export const clientLoader = async (props: Route.ClientLoaderArgs) => {
  return Api.user.getListOfMastersGymer(Number(props.params.mId));
};

const Page = ({ loaderData, params }: Route.ComponentProps) => {
  const viewer = viewerModel.useViewer();
  const match = useMatchExact();

  const navigate = useNavigate();

  const items = useMemo(
    () =>
      loaderData.map<AvatarListItem>((gymmer) => ({
        id: gymmer.gymer_id,
        name: gymmer.username,
      })),
    [loaderData],
  );

  const navigateToGymmer = (g: AvatarListItem) => {
    navigate(`${g.id}/${TaskGroupStatus.Planned}`);
  };

  useEffect(() => {
    if (!params.gId) {
      navigateToGymmer({ id: viewer.gymer?.gymer_id ?? 0 });
    }
  }, []);

  return (
    <Flex height="100%" gap="small" style={{ overflow: 'hidden' }}>
      <AvatarList
        items={items}
        // TODO: fix this dirty hack with child params
        selected={+(params.gId ?? '')}
        pinned={viewer.gymer?.gymer_id}
        onClick={navigateToGymmer}
      />
      <Divider />

      <Outlet />
    </Flex>
  );
};

export default Page;
