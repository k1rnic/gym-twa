import { useToggle } from '@/shared/lib/hooks';
import { Drawer, DrawerProps } from 'antd';
import { PropsWithChildren } from 'react';
import classes from './styles.module.css';

export type PageDrawerProps = {
  onClose?: () => void;
} & Omit<DrawerProps, 'onClose'>;

export const PageDrawer = ({
  open,
  onClose,
  children,
  ...drawerProps
}: PropsWithChildren<PageDrawerProps>) => {
  const [opened, toggle] = useToggle(open);

  const handleClose = () => {
    toggle();
    onClose?.();
  };

  return (
    <Drawer
      closable={false}
      open={opened}
      onClose={handleClose}
      classNames={{ header: classes.header }}
      width="100%"
      placement="right"
      {...drawerProps}
    >
      {children}
    </Drawer>
  );
};
