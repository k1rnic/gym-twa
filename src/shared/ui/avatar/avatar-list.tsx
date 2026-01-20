import { Avatar, AvatarProps } from '@/shared/ui/avatar';
import { Flex } from '@/shared/ui/flex';
import { Divider, Space } from 'antd';
import { useEffect, useRef } from 'react';

export type AvatarListItem = Pick<AvatarProps, 'name' | 'src'> & {
  id: number;
};

export type AvatarListProps = {
  pinned?: number;
  selected?: number;
  items: AvatarListItem[];
  onClick?: (item: AvatarListItem) => void;
};

export const AvatarList = (props: AvatarListProps) => {
  const avatarRefs = useRef<HTMLSpanElement[]>([]);

  const [{ 0: pinned }, other] = props.items.reduce<
    [AvatarListItem[], AvatarListItem[]]
  >(
    (acc, item) => {
      acc[item.id === props.pinned ? 0 : 1].push(item);

      return acc;
    },
    [[], []],
  );

  useEffect(() => {
    if (props.selected) {
      const selectedIndex = other.findIndex((i) => i.id === props.selected);

      avatarRefs.current[selectedIndex]?.scrollIntoView({
        inline: 'start',
        behavior: 'smooth',
      });
    }
  }, [other]);

  return (
    <Flex vertical={false} width="100%">
      {pinned && (
        <>
          <Avatar
            name={pinned.name}
            src={pinned.src}
            active={pinned.id === props.selected}
            onItemClick={() => props.onClick?.(pinned)}
          />
          <Divider type="vertical" style={{ height: '100%' }} />
        </>
      )}

      <Space style={{ flexShrink: 0, overflowX: 'auto', flex: 1 }}>
        {other.map((av, idx) => (
          <Avatar
            key={idx}
            ref={(el) => (avatarRefs.current[idx] = el!)}
            name={av.name}
            src={av.src}
            active={av.id === props.selected}
            onItemClick={() => props.onClick?.(av)}
          />
        ))}
      </Space>
    </Flex>
  );
};
