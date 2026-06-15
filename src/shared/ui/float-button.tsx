import { Button, ButtonProps } from 'antd';

export const FLOAT_BUTTON_SIZE = 64;

type Props = Pick<
  ButtonProps,
  'icon' | 'style' | 'onClick' | 'hidden' | 'danger'
>;

export const FloatButton = ({ style, ...props }: Props) => {
  return (
    <Button
      type="primary"
      shape="circle"
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: FLOAT_BUTTON_SIZE,
        height: FLOAT_BUTTON_SIZE,
        zIndex: 1000,
        ...style,
      }}
      {...props}
    />
  );
};
