import { viewerModel } from '@/entities/viewer';
import { useMatchExact } from '@/shared/lib/router';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { AppToolbar } from '@/widgets/app-toolbar';
import { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router';

export default function Page() {
  const { token } = useTheme();

  const navigate = useNavigate();
  const match = useMatchExact();

  const viewer = viewerModel.useViewer();

  useEffect(() => {
    if (match) {
      navigate(`/workouts`);
    }
  }, [match, viewer]);

  return (
    <Flex
      height="100%"
      width="100%"
      style={{
        backgroundColor: token.colorBgContainer,
        paddingBottom: token.paddingLG,
      }}
    >
      <Flex flex={1} style={{ overflow: 'hidden' }}>
        <Outlet />
      </Flex>
      <Flex px={token.padding}>
        <AppToolbar />
      </Flex>
    </Flex>
  );
}
