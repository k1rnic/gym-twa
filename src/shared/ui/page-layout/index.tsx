import { useViewport } from '@/shared/lib/telegram';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Spin, Typography } from 'antd';
import { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { useNavigation } from 'react-router';

export type PageLayoutProps = {
  title?: ReactNode;
  extra?: ReactNode;
  loading?: boolean;
  showLoadingIndicator?: boolean;
  contentStyle?: CSSProperties;
  pageStyle?: CSSProperties;
};

export const PageLayout = ({
  title,
  extra,
  loading,
  showLoadingIndicator = true,
  children,
  contentStyle,
  pageStyle,
}: PropsWithChildren<PageLayoutProps>) => {
  const { topSafeArea } = useViewport();
  const { token } = useTheme();

  const hasHeader = Boolean(title || extra);

  const navigation = useNavigation();

  const pageLoading = navigation.state === 'loading';

  const spinning = Boolean((pageLoading || loading) && showLoadingIndicator);

  return (
    <Flex
      height="100%"
      width="100%"
      vertical
      style={{ overflow: 'hidden', paddingTop: topSafeArea, ...pageStyle }}
    >
      {hasHeader && (
        <Flex
          align="center"
          justify="space-between"
          vertical={false}
          style={{ width: '100%', flexShrink: 0 }}
          px={token.paddingMD}
        >
          <Flex flex={1} justify="center" style={{ textAlign: 'center' }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
          </Flex>

          {extra ?? <span style={{ width: 64 }} />}
        </Flex>
      )}

      <Flex
        flex={1}
        p={token.padding}
        style={{
          overflow: 'hidden',
          minHeight: 0,
          paddingBottom: 0,
          ...contentStyle,
        }}
      >
        {children}
        <Spin
          fullscreen
          spinning={spinning}
          className="page-spinner"
          delay={250}
        />
      </Flex>
    </Flex>
  );
};
