import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { FireOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons';
import { ConfigProvider, Segmented } from 'antd';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './app-toolbar-styles.module.css';

export const APP_TOOLBAR_HEIGHT = 48;

interface Item {
  label?: ReactNode;
  value: string;
  icon: ReactNode;
}

const items: Item[] = [
  { value: '/workouts', icon: <FireOutlined /> },
  { value: '/exercises', icon: <ReadOutlined /> },
  { value: '/profile', icon: <UserOutlined /> },
];

export type AppToolbarProps = {
  hidden?: boolean;
};

export const AppToolbar = ({ hidden = false }: AppToolbarProps) => {
  const { token } = useTheme();
  const { pathname } = useLocation();

  const activeItem = items.find((item) => pathname.startsWith(item.value));

  const navigate = useNavigate();

  const handleChange = (value: string) => {
    navigate(value);
  };

  return (
    <ConfigProvider
      theme={{
        components: { Segmented: { itemSelectedBg: token.colorPrimary } },
      }}
    >
      <Flex hidden={hidden} px={token.padding} className={styles.container}>
        <Segmented
          block
          shape="round"
          size="large"
          className={styles.segmented}
          options={items}
          value={activeItem?.value}
          onChange={handleChange}
        />
      </Flex>
    </ConfigProvider>
  );
};
