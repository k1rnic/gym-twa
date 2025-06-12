import { ProfileAvatar, ProfileViews } from '@/entities/viewer';
import { useSwitchView } from '@/features/switch-view';
import { Flex } from '@/shared/ui/flex';
import { Divider } from 'antd';
import { Outlet } from 'react-router';

const Page = () => {
  const [, switchView] = useSwitchView();

  return (
    <Flex height="100%" gap="small" style={{ overflow: 'hidden' }}>
      <Flex vertical={false} width="100%">
        <ProfileAvatar mode={ProfileViews.Gymmer} onSwitchView={switchView} />
      </Flex>

      <Divider />
      <Outlet />
    </Flex>
  );
};

export default Page;
