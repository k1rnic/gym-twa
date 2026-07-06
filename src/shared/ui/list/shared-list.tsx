import { useTheme } from '@/shared/lib/theme';
import { List as AntdList, type ListProps as AntdListProps } from 'antd';
import { CSSProperties, ReactNode } from 'react';

export type ListVariant = 'simple' | 'contained';

export type ListProps<T> = {
  items: T[];
  variant?: ListVariant;
  compact?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  itemKey?: keyof T | ((item: T) => React.Key);
  emptyText?: ReactNode;
} & Omit<AntdListProps<T>, 'dataSource' | 'renderItem'>;

export const List = <T,>(props: ListProps<T>) => {
  const {
    items,
    variant = 'simple',
    compact = false,
    renderItem,
    itemKey,
    emptyText,
    rowKey: rowKeyProp,
    locale,
    ...listProps
  } = props;
  const { token } = useTheme();

  const rowKey = itemKey ?? rowKeyProp;

  const containedItemStyle: CSSProperties = {
    background: token.colorBgLayout,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorderSecondary}`,
    padding: compact ? token.paddingSM : token.padding,
    marginTop: token.paddingSM,
  } as const;

  return (
    <AntdList<T>
      {...listProps}
      dataSource={items}
      size={compact ? 'small' : 'default'}
      split={variant === 'simple'}
      rowKey={rowKey}
      locale={emptyText !== undefined ? { ...locale, emptyText } : locale}
      renderItem={(item, index) => (
        <AntdList.Item
          key={rowKey ? undefined : index}
          style={
            variant === 'contained' ? { ...containedItemStyle } : undefined
          }
        >
          {renderItem(item, index)}
        </AntdList.Item>
      )}
    />
  );
};
