import { FloatButton as AntdFloatButton } from 'antd';
import { FloatButtonProps } from 'antd/lib';

export const FLOAT_BUTTON_SIZE = 56;

type Props = Pick<FloatButtonProps, 'icon' | 'style' | 'onClick'>;

export const FloatButton = ({ style, ...props }: Props) => {
  return (
    <AntdFloatButton
      type="primary"
      icon={props.icon}
      style={{ position: 'absolute', right: 0, bottom: 0, ...style }}
      onClick={props.onClick}
    />
  );
};
