import { useViewport } from '@/shared/lib/telegram';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Button, Spin } from 'antd';
import { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { useNavigation } from 'react-router';

export type PageLayoutProps = {
  title?: ReactNode;
  extra?: ReactNode;
  onBackClick?: () => void;
  loading?: boolean;
  showLoadingIndicator?: boolean;
  contentStyle?: CSSProperties;
};

export const PageLayout = ({
  title,
  extra,
  loading,
  showLoadingIndicator = true,
  onBackClick,
  children,
  contentStyle,
}: PropsWithChildren<PageLayoutProps>) => {
  const { topBarOffset } = useViewport();
  const { token } = useTheme();

  const hasHeader = Boolean(title || extra || onBackClick);

  const navigation = useNavigation();

  const pageLoading = navigation.state === 'loading';

  const showSpinner = (pageLoading || loading) && showLoadingIndicator;

  return (
    <Flex height="100%" width="100%" vertical style={{ overflow: 'hidden' }}>
      {hasHeader && (
        <Flex
          align="center"
          justify="space-between"
          vertical={false}
          style={{ width: '100%', paddingTop: topBarOffset, flexShrink: 0 }}
        >
          {onBackClick ? (
            <Button type="link" onClick={onBackClick}>
              Назад
            </Button>
          ) : (
            <span style={{ width: 64 }} />
          )}

          <Flex flex={1} justify="center" style={{ textAlign: 'center' }}>
            {title}
          </Flex>

          {extra ?? <span style={{ width: 64 }} />}
        </Flex>
      )}

      <Flex
        flex={1}
        p={token.padding}
        style={{ overflow: 'hidden', minHeight: 0, ...contentStyle }}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          {children}

          {showSpinner && <Spin fullscreen delay={100} />}
        </div>
      </Flex>
    </Flex>
  );
};
