import { ReactNode } from 'react';

import { RightOutlined } from '@ant-design/icons';

import { Flex } from '@/shared/ui/flex';
import { ListItem, ListItemProps } from '@/shared/ui/list-item';

type ActionListItemProps = {
  nav?: boolean;
  icon?: ReactNode;
  extra?: ReactNode;
} & Omit<ListItemProps, 'leftExtra' | 'rightExtra'>;

export const ActionListItem = ({
  icon,
  nav,
  extra,
  ...listItemProps
}: ActionListItemProps) => {
  return (
    <ListItem
      leftExtra={icon}
      rightExtra={
        <Flex vertical={false}>
          {extra}
          {nav && <RightOutlined />}
        </Flex>
      }
      {...listItemProps}
    />
  );
};
