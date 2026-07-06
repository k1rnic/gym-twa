import { useSortableList } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  CaretDownIcon,
  CaretUpIcon,
  DotsThreeIcon,
} from '@phosphor-icons/react';

import { Card, CardProps, Divider, Dropdown, Space, Typography } from 'antd';
import { MenuProps } from 'antd/lib';
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type CardListItemProps = {
  id: Exclude<React.Key, bigint>;
  title?: ReactNode;
  description?: ReactNode;
  avatar?: ReactNode;
  actions?: MenuProps['items'];
  footer?: ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  onAvatarClick?: () => void;
  onToggle?: (state: boolean) => void;
} & Pick<CardProps, 'style'>;

export const CardListItem = (props: PropsWithChildren<CardListItemProps>) => {
  const {
    id,
    title,
    description,
    avatar,
    actions = [],
    footer,
    collapsible,
    collapsed = true,
    onClick,
    onAvatarClick,
    onToggle,
    children,
    ...cardProps
  } = props;

  const { token } = useTheme();

  const contentRef = useRef<HTMLDivElement>(null);

  const { handler, attributes } = useSortableList(id);

  const draggable = !attributes['aria-disabled'];
  const hasActions = Boolean(actions.filter(Boolean).length);

  const [collapsedInner, setCollapsedInner] = useState(collapsed);

  const handleAvatarClick = () => {
    onAvatarClick?.() || onClick?.();
  };

  const toggleClicked = () => {
    setCollapsedInner((prev) => {
      onToggle?.(prev);
      return !prev;
    });
  };

  const ToggleIcon = useMemo(
    () => (collapsedInner ? CaretUpIcon : CaretDownIcon),
    [collapsedInner],
  );

  useEffect(() => {
    setCollapsedInner(collapsed);
  }, [collapsed]);

  return (
    <Card
      {...cardProps}
      title={
        <Flex vertical={false} align="center">
          {draggable && handler}

          {avatar && (
            <Flex p={token.paddingXXS} onClick={handleAvatarClick}>
              {avatar}
            </Flex>
          )}

          <Flex
            flex={1}
            onClick={onClick}
            px={token.paddingXS}
            py={token.paddingXXS}
            style={{ overflow: 'hidden' }}
          >
            <Typography.Text ellipsis style={{ width: '100%' }}>
              {title}
            </Typography.Text>

            <Typography.Text
              type="secondary"
              style={{ fontWeight: 400, fontSize: token.fontSizeSM }}
            >
              {description}
            </Typography.Text>
          </Flex>
        </Flex>
      }
      extra={
        <Space size={token.padding}>
          {hasActions && (
            <Dropdown menu={{ items: actions }} trigger={['click']}>
              <DotsThreeIcon />
            </Dropdown>
          )}

          {collapsible && <ToggleIcon onClick={toggleClicked} />}
        </Space>
      }
      styles={{ body: { padding: 0 }, ...cardProps.style }}
    >
      <Flex>
        <Flex
          ref={contentRef}
          px={token.paddingXS}
          style={{
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.2s ease',
            maxHeight:
              collapsible && collapsedInner
                ? 0
                : contentRef.current?.scrollHeight,
            opacity: collapsible && collapsedInner ? 0 : 1,
          }}
        >
          {children}
        </Flex>

        {footer && !collapsedInner && <Divider style={{ margin: 0 }} />}

        <Flex
          hidden={!footer}
          px={token.paddingSM}
          py={token.paddingXS}
          onClick={onClick}
        >
          {footer}
        </Flex>
      </Flex>
    </Card>
  );
};
