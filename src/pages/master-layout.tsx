import { GymmerAvatarList } from '@/entities/gymmer';
import { Api } from '@/shared/api';

import { ProfileAvatar, ProfileViews } from '@/entities/viewer';
import { useSwitchView } from '@/features/switch-view';
import { useLocalStorage } from '@/shared/lib/hooks';
import { Flex } from '@/shared/ui/flex';
import { Divider } from 'antd';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/master-layout';

export const clientLoader = async (props: Route.ClientLoaderArgs) => {
  return await Api.user.getListOfMastersGymer(Number(props.params.mId));
};

const Page = (props: Route.ComponentProps) => {
  const { loaderData: items } = props;
  const navigate = useNavigate();
  const [, switchView] = useSwitchView();

  const [selectedGymmerIndex, setSelectedGymmerIndex] = useLocalStorage<number>(
    'master_gymmer_index',
    0,
  );

  const selectedGymmerId = items[selectedGymmerIndex]?.gymer_id;

  useEffect(() => {
    if (selectedGymmerId) {
      navigate(`${selectedGymmerId}`);
    }
  }, [selectedGymmerId]);

  return (
    <Flex height="100%" gap="small" style={{ overflow: 'hidden' }}>
      <Flex vertical={false} width="100%">
        <ProfileAvatar mode={ProfileViews.Master} onSwitchView={switchView} />
        <Divider type="vertical" style={{ height: '100%' }} />
        <GymmerAvatarList
          items={items}
          selectedIndex={selectedGymmerIndex}
          onItemClick={(_, idx) => setSelectedGymmerIndex(idx)}
        />
      </Flex>

      <Divider />

      <Outlet />
    </Flex>
  );
};

export default Page;
