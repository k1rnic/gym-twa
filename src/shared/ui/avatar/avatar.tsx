import { stringToColor } from '@/shared/lib/string';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  AvatarProps as AntdAvatarProps,
  Avatar as AvatarAntd,
  Typography,
} from 'antd';
import { forwardRef } from 'react';
import classes from './avatar-styles.module.css';

const BORDER_WIDTH = 3;
const BORDER_OFFSET = 1;

const stringAvatar = (name: string) => ({
  color: stringToColor(name),
  children: `${name.toUpperCase()[0]}`,
});

export type AvatarProps = {
  name?: string;
  active?: boolean;
  size?: number;
  src?: string;
  disableFallback?: boolean;
  onItemClick?: () => void;
} & Pick<AntdAvatarProps, 'icon'>;

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const { name, active, size = 64, src, onItemClick } = props;
  const { token } = useTheme();

  const containerSize = size + (BORDER_WIDTH + BORDER_OFFSET) * 2;

  const avatarFallback = stringAvatar(name || '');

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
        <AvatarAntd
          ref={ref}
          size={size}
          src={src}
          className={classes.avatar}
          style={{ backgroundColor: avatarFallback.color }}
          onClick={() => onItemClick?.()}
        >
          {!props.disableFallback && avatarFallback.children}
        </AvatarAntd>
      </Flex>

      <Typography.Text ellipsis>{name}</Typography.Text>
    </Flex>
  );
});
