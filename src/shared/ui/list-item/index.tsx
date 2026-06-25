import { PropsWithChildren, ReactNode } from 'react';

import { Card, Typography } from 'antd';

import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';

const { Text } = Typography;

export type ListItemProps = PropsWithChildren<{
  leftExtra?: ReactNode;
  rightExtra?: ReactNode;
  onClick?: () => void;
}>;

export const ListItem = ({
  leftExtra,
  rightExtra,
  onClick,
  children,
}: PropsWithChildren<ListItemProps>) => {
  const { token } = useTheme();

  return (
    <Card onClick={onClick} styles={{ body: { padding: token.paddingMD } }}>
      <Flex vertical={false} align="center" justify="space-between" gap={12}>
        <Flex flex={1} gap={12} justify="center">
          {leftExtra}
          <Text>{children}</Text>
        </Flex>

        {rightExtra}
      </Flex>
    </Card>
  );
};
