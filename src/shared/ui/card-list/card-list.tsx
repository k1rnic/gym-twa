import { useSortableList } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Empty } from 'antd';
import React, { useMemo } from 'react';

interface RenderItemProps {
  id: Exclude<React.Key, bigint>;
}

export type CardListProps<T> = {
  items: T[];
  itemKey: keyof T & string;
  reorderEnabled?: boolean;
  loading?: boolean;
  emptyText?: string;
  showEmptyPlaceholder?: boolean;
  onReorder?: (items: T[]) => void;
  renderItem: (item: T, props: RenderItemProps, idx: number) => React.ReactNode;
};

export const CardList = <T,>({
  items,
  loading,
  emptyText = 'Нет данных',
  showEmptyPlaceholder = true,
  itemKey,
  reorderEnabled,
  onReorder,
  renderItem,
}: CardListProps<T>) => {
  const { token } = useTheme();

  const noData = !loading && items.length === 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const itemIds = useMemo(
    () => items.map((i) => ({ id: String(i[itemKey]) })),
    [items, itemKey],
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.findIndex(({ id }) => id === active.id);
    const newIndex = itemIds.findIndex(({ id }) => id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder?.(reordered);
  };

  return noData && showEmptyPlaceholder ? (
    <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  ) : (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
    >
      <SortableContext
        items={itemIds}
        disabled={!reorderEnabled}
        strategy={verticalListSortingStrategy}
      >
        <Flex
          vertical
          gap={token.paddingXS}
          style={{ maxHeight: '100%', overflowY: 'auto' }}
        >
          {items.map((item, idx) => (
            <ItemContextWrapper
              id={itemIds[idx].id}
              index={idx}
              key={itemIds[idx].id}
              item={item}
              renderItem={renderItem}
            />
          ))}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

type ItemContextWrapperProps<T> = {
  id: Exclude<React.Key, bigint>;
  index: number;
  item: T;
} & Pick<CardListProps<T>, 'renderItem'>;

const ItemContextWrapper = <T,>({
  id,
  index,
  item,
  renderItem,
}: ItemContextWrapperProps<T>) => {
  const { setNodeRef, style } = useSortableList(id);

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, { id }, index)}
    </div>
  );
};
