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
