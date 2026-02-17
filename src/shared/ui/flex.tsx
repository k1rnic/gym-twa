import { useSpacing, UseSpacingProps } from '@/shared/lib/theme';
import { Flex as FlexAntd, FlexProps as FlexAntdProps } from 'antd';
import { AnyObject } from 'antd/lib/_util/type';
import { CSSProperties, forwardRef, PropsWithChildren } from 'react';

export type FlexProps<P = AnyObject> = Omit<
  FlexAntdProps<P>,
  'children' | 'ref'
> &
  Pick<CSSProperties, 'height' | 'width'> &
  UseSpacingProps;

export const Flex = forwardRef<HTMLDivElement, PropsWithChildren<FlexProps>>(
  (props, ref) => {
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
        ref={ref}
        vertical={vertical}
        style={{ width, height, ...paddingStyles, ...flexProps.style }}
      >
        {children}
      </FlexAntd>
    );
  },
);
