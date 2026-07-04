import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { PropsWithChildren } from 'react';

type Props = {
  left?: number;
  right?: number;
  hidden?: boolean;
};

export default ({
  hidden,
  children,
  left,
  right,
}: PropsWithChildren<Props>) => {
  const { token } = useTheme();

  return (
    <Flex
      hidden={hidden}
      p={token.paddingXXS}
      style={{
        position: 'fixed',
        bottom: token.paddingXS,
        left,
        right,
        backgroundColor: token.colorBgLayout,
        borderRadius: token.borderRadius,
      }}
    >
      {children}
    </Flex>
  );
};
