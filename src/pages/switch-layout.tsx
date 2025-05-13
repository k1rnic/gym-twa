import { Flex, Segmented } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

type LayoutView = 'gymmer' | 'coach';

const OPTIONS: SegmentedOptions<LayoutView> = [
  { label: ' Спортсмен', value: 'gymmer' },
  { label: 'Тренер', value: 'coach' },
];

export default function Page() {
  const [view, setView] = useState<LayoutView>('gymmer');

  useEffect(() => {}, [view]);

  return (
    <Flex vertical>
      <Segmented block value={view} onChange={setView} options={OPTIONS} />
      <Outlet />
    </Flex>
  );
}
