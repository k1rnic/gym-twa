import { isDefined } from '@/shared/lib/is-defined';
import { useCallback, useMemo } from 'react';

type Spacing = number | string;

type Axis = 'x' | 'y';
type Direction = 'left' | 'right' | 'top' | 'bottom';
type SpaceProp = 'padding' | 'margin';
type SpacePropAlias = 'p' | 'm';

type SpacingStyles = {
  [P in SpaceProp as P | `${P}${LocalUpperCase<Direction>}`]?: Spacing;
};

export type UseSpacingProps = {
  [K in SpacePropAlias]?: Spacing | [py: Spacing, px: Spacing];
} & {
  [K in `${SpacePropAlias}${Axis}`]?: Spacing;
};

export const useSpacing = (props: UseSpacingProps) => {
  const getStylesByPropType = useCallback(
    (prop: SpaceProp) => {
      const alias: SpacePropAlias = prop === 'padding' ? 'p' : 'm';
      const aliasX: `${SpacePropAlias}${Axis}` = `${alias}x`;
      const aliasY: `${SpacePropAlias}${Axis}` = `${alias}y`;
      const styles: SpacingStyles = {};

      if (isDefined(props[alias])) {
        styles[prop] =
          props[alias] instanceof Array
            ? props[alias].map((i) => `${i}px`).join(' ')
            : props[alias];
      }
      if (isDefined(props[aliasX])) {
        styles[`${prop}Left`] = props[aliasX];
        styles[`${prop}Right`] = props[aliasX];
      }
      if (isDefined(props[aliasY])) {
        styles[`${prop}Top`] = props[aliasY];
        styles[`${prop}Bottom`] = props[aliasY];
      }

      return styles;
    },
    [props],
  );

  return useMemo<SpacingStyles>(() => {
    return (['padding', 'margin'] as SpaceProp[]).reduce(
      (styles, prop) => ({ ...styles, ...getStylesByPropType(prop) }),
      {},
    );
  }, [getStylesByPropType]);
};
