import { useTheme } from '@/shared/lib/theme';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import { useLocation, useNavigate } from 'react-router';

export const APP_TOOLBAR_HEIGHT = 64;

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

  const handleRadioChange = (e: RadioChangeEvent) => {
    navigate(e.target.value);
  };

  return (
    <Radio.Group
      value={activeItem?.value}
      size="middle"
      optionType="button"
      buttonStyle="solid"
      style={{
        width: 'max-content',
        position: 'absolute',
        bottom: 4,
        zIndex: 1000,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: `4px solid ${token.colorBgContainer}`,
        borderRadius: token.borderRadiusLG,
      }}
      onChange={handleRadioChange}
    >
      {items.map((item) => (
        <Radio.Button key={item.value} value={item.value}>
          {item.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
