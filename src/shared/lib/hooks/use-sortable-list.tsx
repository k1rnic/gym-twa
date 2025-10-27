import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

export const useSortableList = (id: string | number) => {
  const sortable = useSortable({ id });

  const style: React.CSSProperties = useMemo(
    () => ({
      transform: CSS.Translate.toString(sortable.transform),
      transition: sortable.transition,
      opacity: sortable.isDragging ? 0.5 : 1,
      zIndex: sortable.isDragging ? 1000 : 'auto',
    }),
    [sortable],
  );

  const handler = useMemo(
    () => (
      <HolderOutlined
        style={{
          touchAction: 'none',
          width: 24,
          height: 24,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...sortable.listeners}
        {...sortable.attributes}
      />
    ),
    [sortable.listeners, sortable.attributes],
  );

  return useMemo(
    () => ({ ...sortable, style, handler }),
    [sortable, style, handler],
  );
};
