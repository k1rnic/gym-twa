import { MastersGymer } from '@/shared/api';
import { Avatar } from '@/shared/ui/avatar';
import { Space } from 'antd';
import { useRef } from 'react';

type Props = {
  items: MastersGymer[];
  selectedIndex?: number;
  onItemClick?: (item: MastersGymer, index: number) => void;
};

export const GymmerAvatarList = ({
  items = [],
  selectedIndex = 0,
  onItemClick,
}: Props) => {
  const avatarRefs = useRef<HTMLSpanElement[]>([]);

  const selectedAvatar = items[selectedIndex];

  // useEffect(() => {
  //   if (selectedAvatar) {
  //     const selectedIndex = items.findIndex(
  //       (i) => i.gymer_id === selectedAvatar?.gymer_id,
  //     );

  //     avatarRefs.current[selectedIndex]?.scrollIntoView({
  //       inline: 'start',
  //       behavior: 'smooth',
  //     });
  //   }
  // }, []);

  return (
    <Space style={{ flexShrink: 0, overflowX: 'auto', flex: 1 }}>
      {items.map((gymmer, idx) => (
        <Avatar
          key={gymmer.gymer_id}
          ref={(el) => (avatarRefs.current[idx] = el!)}
          name={gymmer.username}
          active={selectedAvatar?.gymer_id === gymmer.gymer_id}
          onItemClick={() => onItemClick?.(gymmer, idx)}
        />
      ))}
    </Space>
  );
};
