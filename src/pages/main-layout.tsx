import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { AppToolbar } from '@/widgets/app-toolbar';
import { disableVerticalSwipes } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

import { Outlet } from 'react-router';

export default function Page() {
  const { token } = useTheme();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const preserveVerticalSwipes = () => {
      disableVerticalSwipes();
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('DOMContentLoaded', preserveVerticalSwipes);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('DOMContentLoaded', preserveVerticalSwipes);
    };
  }, []);

  return (
    <Flex
      height="100%"
      width="100%"
      gap="small"
      p={token.padding}
      style={{ backgroundColor: token.colorBgContainer, paddingBottom: 0 }}
    >
      <Flex
        flex={1}
        style={{ overflow: 'hidden', paddingTop: token.paddingXS }}
      >
        <Outlet />
      </Flex>
      <AppToolbar />
    </Flex>
  );
}
