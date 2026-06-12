import { useTheme } from '@/shared/lib/theme';
import { RightOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { CSSProperties, KeyboardEvent, MouseEvent, useMemo } from 'react';

export type ListItemProps = {
  avatar?: React.ReactNode;
  header: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
  actions?: React.ReactNode[];
  nav?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: CSSProperties;
};

export const ListItem = ({
  avatar,
  header,
  description,
  extra,
  actions,
  nav,
  onClick,
  className,
  style,
}: ListItemProps) => {
  const { token } = useTheme();
  const interactive = Boolean(onClick);

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width: '100%',
      minWidth: 0,
      cursor: interactive ? 'pointer' : undefined,
      outline: 'none',
      ...style,
    }),
    [interactive, style],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const isActivationKey = event.key === 'Enter' || event.key === ' ';

    if (isActivationKey) {
      event.preventDefault();
      onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={className}
      style={containerStyle}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: token.paddingSM,
          position: 'relative',
          paddingRight: nav ? 32 : 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: token.paddingSM,
            minWidth: 0,
            flex: 1,
          }}
        >
          {avatar && (
            <div style={{ marginTop: 2, flexShrink: 0 }}>{avatar}</div>
          )}

          <div
            style={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: token.paddingXS,
            }}
          >
            <div style={{ minWidth: 0 }}>{header}</div>
            {description && (
              <Typography.Text
                type="secondary"
                style={{ display: 'block', marginTop: 2 }}
              >
                {description}
              </Typography.Text>
            )}
            {actions && actions.length > 0 && (
              <Space wrap size="small" style={{ marginTop: token.paddingXS }}>
                {actions}
              </Space>
            )}
          </div>
        </div>

        {extra && (
          <div style={{ minWidth: 0, marginLeft: 'auto' }}>{extra}</div>
        )}

        {nav && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 24,
            }}
          >
            <RightOutlined />
          </div>
        )}
      </div>
    </div>
  );
};
