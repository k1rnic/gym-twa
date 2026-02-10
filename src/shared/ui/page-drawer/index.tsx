import { useToggle } from '@/shared/lib/hooks';
import { Flex } from '@/shared/ui/flex';
import { Button, Drawer, DrawerProps } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';

export type PageDrawerProps = {
  onClose?: () => void;
  extra?: ReactNode;
} & Omit<DrawerProps, 'onClose'>;

export const PageDrawer = ({
  open,
  onClose,
  children,
  title,
  extra,
  ...drawerProps
}: PropsWithChildren<PageDrawerProps>) => {
  const [opened, toggle] = useToggle(open);

  const handleClose = () => {
    toggle();
    onClose?.();
  };

  return (
    <Drawer
      push={false}
      closable={false}
      open={opened}
      width="100%"
      title={
        <Flex
          align="center"
          justify="space-between"
          vertical={false}
          style={{ width: '100%' }}
        >
          <Button type="link" onClick={handleClose}>
            Назад
          </Button>
          <Flex flex={1} justify="center" style={{ textAlign: 'center' }}>
            {title}
          </Flex>

          {extra}
        </Flex>
      }
      {...drawerProps}
    >
      {children}
    </Drawer>
  );
};
