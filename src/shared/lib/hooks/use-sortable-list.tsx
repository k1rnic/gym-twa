import { useTheme } from '@/shared/lib/theme';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVerticalIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';

export const useSortableList = (id: string | number) => {
  const { token } = useTheme();
  const sortable = useSortable({ id });

  const isDragging = sortable.isDragging;
  const isAnyDragging = Boolean(sortable.active);

  const style: React.CSSProperties = useMemo(
    () => ({
      transform: CSS.Translate.toString(sortable.transform),
      transition: sortable.transition,
      opacity: isDragging ? 1 : isAnyDragging ? 0.35 : 1,
      zIndex: isDragging ? 1000 : 'auto',
      boxShadow: isDragging ? token.boxShadowSecondary : undefined,
    }),
    [
      sortable.transform,
      sortable.transition,
      isDragging,
      isAnyDragging,
      token.boxShadowSecondary,
    ],
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
