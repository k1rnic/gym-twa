import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import { useLocation, useNavigate } from 'react-router';

export const APP_TOOLBAR_HEIGHT = 72;

interface Item {
  label: string;
  value: string;
}

const items: Item[] = [
  { label: 'Тренировки', value: '/workouts' },
  { label: 'Упражнения', value: '/exercises' },
  { label: 'Профиль', value: '/profile' },
];

export const AppToolbar = () => {
  const { token } = useTheme();
  const { pathname } = useLocation();

  const activeItem = items.find((item) => pathname.startsWith(item.value));

  const navigate = useNavigate();

  const handleChange = (e: RadioChangeEvent) => {
    navigate(e.target.value);
  };

  return (
    <Flex
      height={APP_TOOLBAR_HEIGHT}
      align="center"
      justify="flex-start"
      width="100%"
      style={{ paddingTop: 8 }}
    >
      <Radio.Group
        block
        value={activeItem?.value}
        size="middle"
        optionType="button"
        buttonStyle="solid"
        style={{ width: '100%', borderRadius: token.borderRadiusLG }}
        onChange={handleChange}
      >
        {items.map((item) => (
          <Radio.Button key={item.value} value={item.value}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Flex>
  );
};
