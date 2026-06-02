import { useViewport } from '@/shared/lib/telegram';
import { Flex } from '@/shared/ui/flex';
import { Button } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';

export type PageLayoutProps = {
  title?: ReactNode;
  extra?: ReactNode;
  onBackClick?: () => void;
};

export const PageLayout = ({
  title,
  extra,
  onBackClick,
  children,
}: PropsWithChildren<PageLayoutProps>) => {
  const { topBarOffset } = useViewport();

  const hasHeader = Boolean(title || extra || onBackClick);

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

      <Flex flex={1} style={{ overflow: 'hidden', minHeight: 0 }}>
        {children}
      </Flex>
    </Flex>
  );
};
