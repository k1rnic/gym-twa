import { useLocalStorage } from '@/shared/lib/hooks';
import { useTelegramData } from '@/shared/lib/telegram';
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
  const { user } = useTelegramData();
  const { token } = useTheme();

  const [view, setView] = useLocalStorage<LayoutView>('view_mode', 'gymmer');

  useEffect(() => {
    if (user?.id) {
      navigate(`/${view}/${user.id}`);
    }
  }, [view, user?.id]);

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
