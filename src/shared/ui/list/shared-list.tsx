import { useTheme } from '@/shared/lib/theme';
import { List, type ListProps } from 'antd';
import { ReactNode } from 'react';

export type SharedListVariant = 'simple' | 'contained';

export interface SharedListProps<T>
  extends Omit<ListProps<T>, 'dataSource' | 'renderItem'> {
  items: T[];
  variant?: SharedListVariant;
  compact?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  itemKey?: keyof T | ((item: T) => React.Key);
  emptyText?: ReactNode;
}

export const SharedList = <T,>(props: SharedListProps<T>) => {
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

  const containedItemStyle = {
    background: token.colorFillSecondary,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorderSecondary}`,
    padding: compact ? token.paddingSM : token.padding,
    marginTop: token.paddingSM,
  } as const;

  return (
    <List<T>
      {...listProps}
      dataSource={items}
      size={compact ? 'small' : 'default'}
      split={variant === 'simple'}
      rowKey={rowKey}
      locale={emptyText !== undefined ? { ...locale, emptyText } : locale}
      renderItem={(item, index) => (
        <List.Item
          key={rowKey ? undefined : index}
          style={
            variant === 'contained' ? { ...containedItemStyle } : undefined
          }
        >
          {renderItem(item, index)}
        </List.Item>
      )}
    />
  );
};
