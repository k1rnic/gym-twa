import { useSpacing, UseSpacingProps } from '@/shared/lib/theme';
import { Flex as FlexAntd, FlexProps as FlexAntdProps } from 'antd';
import { CSSProperties } from 'react';

export type FlexProps<P> = FlexAntdProps<P> &
  Pick<CSSProperties, 'height' | 'width'> &
  UseSpacingProps;

export const Flex = <P,>(props: FlexProps<P>) => {
  const {
    p = 0,
    px,
    py,
    height,
    width,
    children,
    vertical = true,
    ...flexProps
  } = props;
  const paddingStyles = useSpacing({ p, px, py });

  return (
    <FlexAntd
      {...flexProps}
      vertical={vertical}
      style={{ width, height, ...paddingStyles, ...flexProps.style }}
    >
      {children}
    </FlexAntd>
  );
};
