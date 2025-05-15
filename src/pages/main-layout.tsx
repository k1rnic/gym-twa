import { viewerModel } from '@/entities/viewer';
import { useLocalStorage } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex, Segmented } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

type LayoutView = 'gymmer' | 'coach';

const OPTIONS: SegmentedOptions<LayoutView> = [
  { label: ' Спортсмен', value: 'gymmer' },
  { label: 'Тренер', value: 'coach' },
];

export default function Page() {
  const navigate = useNavigate();
  const viewer = viewerModel.useViewer();

  const { token } = useTheme();

  const [view, setView] = useLocalStorage<LayoutView>('view_mode', 'gymmer');

  useEffect(() => {
    if (viewer) {
      navigate(
        `/${view}/${
          view === 'coach' ? viewer.master?.master_id : viewer.gymer?.gymer_id
        }`,
      );
    }
  }, [view, viewer]);

  return (
    <Flex
      vertical
      gap="small"
      style={{ height: '100%', width: '100%', padding: token.padding }}
    >
      <Segmented block value={view} onChange={setView} options={OPTIONS} />
      <Flex vertical flex={1}>
        <Outlet />
      </Flex>
    </Flex>
  );
}
