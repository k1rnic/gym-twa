import { useRef, useState } from 'react';

import { useTheme } from '@/shared/lib/theme';

import { Flex } from '@/shared/ui/flex';

import { TrashIcon } from '@phosphor-icons/react';

import { useTranslation } from 'react-i18next';

export type SwipeableItemProps = {
  children: React.ReactNode;
  canRemove: boolean;
  onRemove(): void;
};

const DELETE_ACTION_WIDTH = 72;
const SWIPE_DELETE_THRESHOLD = 120;
const ANIMATION_DURATION = 180;

export const SwipeableItem = ({
  children,
  canRemove,
  onRemove,
}: SwipeableItemProps) => {
  const { token } = useTheme();
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const startOffsetRef = useRef(0);

  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canRemove || isDeleting) {
      return;
    }

    startPointRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    startOffsetRef.current = offset;

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canRemove || !startPointRef.current || isDeleting) {
      return;
    }

    const deltaX = event.clientX - startPointRef.current.x;
    const deltaY = event.clientY - startPointRef.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    const nextOffset = Math.min(0, startOffsetRef.current + deltaX);

    setOffset(nextOffset);
  };

  const resetPointer = () => {
    startPointRef.current = null;
    startOffsetRef.current = 0;
    setIsDragging(false);
  };

  const handleRemove = () => {
    if (isDeleting) {
      return;
    }

    const width = containerRef.current?.offsetWidth;

    if (!width) {
      onRemove();
      return;
    }

    setIsDeleting(true);
    setIsDragging(false);
    setOffset(-width);

    window.setTimeout(onRemove, ANIMATION_DURATION);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canRemove || !startPointRef.current || isDeleting) {
      resetPointer();
      return;
    }

    const deltaX = event.clientX - startPointRef.current.x;

    resetPointer();

    if (deltaX < -SWIPE_DELETE_THRESHOLD) {
      handleRemove();
      return;
    }

    if (offset < -DELETE_ACTION_WIDTH / 2) {
      setOffset(-DELETE_ACTION_WIDTH);
      return;
    }

    setOffset(0);
  };

  const handlePointerCancel = () => {
    if (isDeleting) {
      return;
    }

    resetPointer();
    setOffset(0);
  };

  const handleClick = () => {
    if (offset < 0 && !isDragging && !isDeleting) {
      setOffset(0);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', flexShrink: 0 }}
    >
      {canRemove && (
        <Flex
          vertical={false}
          align="center"
          justify="flex-end"
          style={{
            inset: 0,
            position: 'absolute',
            backgroundColor: token.colorError,
            margin: 2,
            borderRadius: token.borderRadius,
          }}
        >
          <Flex
            vertical={false}
            align="center"
            justify="center"
            style={{
              width: DELETE_ACTION_WIDTH,
              height: '100%',
              cursor: 'pointer',
            }}
            role="button"
            tabIndex={offset < 0 ? 0 : -1}
            onClick={handleRemove}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleRemove();
              }
            }}
          >
            <TrashIcon size={20} color={token.colorWhite} />
          </Flex>
        </Flex>
      )}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          transform: `translateX(${offset}px)`,
          transition: isDragging
            ? 'none'
            : `transform ${ANIMATION_DURATION}ms ease`,
          touchAction: canRemove ? 'pan-y' : 'auto',
          userSelect: isDragging ? 'none' : undefined,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
      >
        {children}
      </div>
    </div>
  );
};
