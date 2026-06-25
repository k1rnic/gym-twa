import { stringToColor } from '@/shared/lib/string';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Avatar, AvatarProps, Typography } from 'antd';
import { forwardRef, useState } from 'react';
import classes from './user-avatar-list-item-styles.module.css';

const BORDER_WIDTH = 3;
const BORDER_OFFSET = 1;

const stringAvatar = (name: string) => ({
  color: stringToColor(name),
  children: `${name.toUpperCase()[0]}`,
});

export type UserAvatarListItemProps = {
  name?: string;
  active?: boolean;
  size?: number;
  src?: string;
  disableFallback?: boolean;
  onItemClick?: () => void;
} & Pick<AvatarProps, 'icon'>;

export const UserAvatarListItem = forwardRef<
  HTMLSpanElement,
  UserAvatarListItemProps
>((props, ref) => {
  const { name, active, size = 64, src, onItemClick } = props;
  const { token } = useTheme();

  const containerSize = size + (BORDER_WIDTH + BORDER_OFFSET) * 2;

  const avatarFallback = stringAvatar(name || '');

  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const handleErrorRaised = () => {
    setAvatarLoadError(true);
    return true;
  };

  return (
    <Flex className={classes.root} width={containerSize}>
      <Flex
        className={classes.avatarWrapper}
        style={{
          borderColor: active ? token.colorSuccess : 'transparent',
          borderWidth: BORDER_WIDTH,
          padding: BORDER_OFFSET,
        }}
      >
        <Avatar
          ref={ref}
          size={size}
          src={src}
          className={classes.avatar}
          style={{
            backgroundColor: avatarLoadError ? avatarFallback.color : undefined,
          }}
          onClick={() => onItemClick?.()}
          onError={handleErrorRaised}
        >
          {!props.disableFallback && avatarFallback.children}
        </Avatar>
      </Flex>

      <Typography.Text ellipsis>{name}</Typography.Text>
    </Flex>
  );
});
