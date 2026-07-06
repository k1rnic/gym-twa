import { Flex } from '@/shared/ui/flex';
import { Divider, Space } from 'antd';
import { useEffect, useRef } from 'react';
import {
  UserAvatarListItem,
  UserAvatarListItemProps,
} from './user-avatar-list-item';

export type UserAvatarListItem = Pick<
  UserAvatarListItemProps,
  'name' | 'src'
> & {
  id: number;
};

export type UserAvatarListProps = {
  pinned?: number;
  selected?: number;
  items: UserAvatarListItem[];
  onClick?: (item: UserAvatarListItem) => void;
};

export const UserAvatarList = (props: UserAvatarListProps) => {
  const avatarRefs = useRef<HTMLSpanElement[]>([]);

  const [{ 0: pinned }, other] = props.items.reduce<
    [UserAvatarListItem[], UserAvatarListItem[]]
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
          <UserAvatarListItem
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
          <UserAvatarListItem
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
