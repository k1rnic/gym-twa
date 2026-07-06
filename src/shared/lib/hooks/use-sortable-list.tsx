import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVerticalIcon } from '@phosphor-icons/react';
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

  delete sortable.attributes['aria-pressed'];

  const handler = useMemo(
    () => (
      <DotsSixVerticalIcon
        style={{ touchAction: 'none', outline: 'none' }}
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
