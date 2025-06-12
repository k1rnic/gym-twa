import { viewerModel } from '@/entities/viewer';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';

import { useSwitchView } from '@/features/switch-view';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Route } from './+types/main-layout';

export default function Page(props: Route.ComponentProps) {
  const navigate = useNavigate();
  const [view] = useSwitchView();
  const { token } = useTheme();

  const viewer = viewerModel.useViewer();
  const viewerId =
    view === 'master' ? viewer.master?.master_id : viewer.gymer?.gymer_id;

  useEffect(() => {
    const isDiffView = !props.matches.at(-1)?.pathname.startsWith(`/${view}`);

    if (isDiffView) {
      navigate(`/${view}/${viewerId}`);
    }
  }, [view]);

  return (
    <Flex
      gap="small"
      p={token.padding}
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Flex flex={1} py={token.paddingXS} style={{ overflow: 'hidden' }}>
        <Outlet />
      </Flex>
    </Flex>
  );
}
