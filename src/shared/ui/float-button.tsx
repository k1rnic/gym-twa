import { Button } from 'antd';
import { FloatButtonProps } from 'antd/lib';

export const FLOAT_BASE_BUTTON_SIZE = 48;
export const FLOAT_BUTTON_SIZE = FLOAT_BASE_BUTTON_SIZE + 16;

type Props = Pick<FloatButtonProps, 'icon' | 'style' | 'onClick'>;

export const FloatButton = ({ style, ...props }: Props) => {
  return (
    <Button
      size="large"
      type="primary"
      shape="circle"
      icon={props.icon}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: FLOAT_BASE_BUTTON_SIZE,
        height: FLOAT_BASE_BUTTON_SIZE,
        zIndex: 1000,
        ...style,
      }}
      onClick={props.onClick}
    />
  );
};
