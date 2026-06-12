import { UserAvatar, UserAvatarProps } from '@/entities/user';
import { Flex } from '@/shared/ui/flex';
import { Divider, Space } from 'antd';
import { useEffect, useRef } from 'react';

export type UserAvatarListItem = Pick<UserAvatarProps, 'name' | 'src'> & {
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
          <UserAvatar
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
          <UserAvatar
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
