import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  BarbellIcon,
  IconProps,
  NotepadIcon,
  UserIcon,
} from '@phosphor-icons/react';
import { Segmented } from 'antd';
import { ComponentType, ReactNode, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './app-toolbar-styles.module.css';

const IconContainer = ({ Icon }: { Icon: ComponentType<IconProps> }) => (
  <Flex>
    <Icon weight="fill" />
  </Flex>
);

interface Item {
  label: ReactNode;
  value: string;
  className?: string;
}

const items: Item[] = [
  {
    value: '/workouts',
    label: <IconContainer Icon={BarbellIcon} />,
    className: styles.segmentedItem,
  },
  {
    value: '/exercises',
    label: <IconContainer Icon={NotepadIcon} />,
    className: styles.segmentedItem,
  },
  {
    value: '/profile',
    label: <IconContainer Icon={UserIcon} />,
    className: styles.segmentedItem,
  },
];

export type AppToolbarProps = {
  hidden?: boolean;
};

export const AppToolbar = ({ hidden = false }: AppToolbarProps) => {
  const { token } = useTheme();
  const { pathname } = useLocation();

  const defaultActiveItem = items[0].value;

  const activeItem = useMemo(
    () => items.find((item) => pathname.startsWith(item.value)),
    [pathname],
  );

  const navigate = useNavigate();
  const handleChange = (value: string) => navigate(value);

  return (
    <Flex hidden={hidden} px={token.padding} className={styles.container}>
      <Segmented
        block
        shape="round"
        size="large"
        className={styles.segmented}
        options={items}
        value={activeItem?.value ?? defaultActiveItem}
        onChange={handleChange}
        onTouchEnd={() => activeItem && navigate(activeItem.value)}
      />
    </Flex>
  );
};
