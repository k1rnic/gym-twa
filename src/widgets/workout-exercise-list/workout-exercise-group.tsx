import { workoutModel } from '@/entities/workout';
import { useDeleteWorkoutGroupAction } from '@/features/delete-workout-group';
import { TaskGroupBlock } from '@/shared/api';
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
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DotsThreeIcon } from '@phosphor-icons/react';
import { Dropdown, Typography } from 'antd';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { workoutRowId } from './lib/workout-order';
import { ExerciseCard } from './workout-exercise-card';

type WorkoutExerciseGroupProps = {
  id: string;
  w: workoutModel.Workout;
  group: TaskGroupBlock;
  tasks: workoutModel.WorkoutExercise[];
  reorderEnabled?: boolean;
  onInnerReorder: (from: number, to: number) => void;
  onExerciseClick: (taskId: workoutModel.WorkoutExercise['task_id']) => void;
};

export const WorkoutExerciseGroup = ({
  id,
  w,
  group,
  tasks,
  reorderEnabled,
  onInnerReorder,
  onExerciseClick,
}: WorkoutExerciseGroupProps) => {
  const { t } = useTranslation();
  const { token } = useTheme();
  const { setNodeRef, style, handler, attributes } = useSortableList(id);
  const deleteAction = useDeleteWorkoutGroupAction(
    w,
    group.task_group_block_id,
  );

  const draggable = !attributes['aria-disabled'];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const itemIds = useMemo(
    () => tasks.map((task) => ({ id: workoutRowId.task(task.task_id) })),
    [tasks],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = itemIds.findIndex(({ id: itemId }) => itemId === active.id);
    const to = itemIds.findIndex(({ id: itemId }) => itemId === over.id);
    if (from === -1 || to === -1) return;

    onInnerReorder(from, to);
  };

  return (
    <Flex
      ref={setNodeRef}
      gap={token.paddingXS}
      style={{
        borderLeft: `3px solid ${token.colorPrimary}`,
        paddingLeft: token.paddingSM,
        ...style,
      }}
    >
      <Flex
        vertical={false}
        align="center"
        justify="space-between"
        width="100%"
      >
        <Flex vertical={false} align="center" gap={token.paddingXS}>
          {draggable && handler}
          <Typography.Text strong>
            {t(`training.groupType.${group.group_type}`)}
          </Typography.Text>
        </Flex>

        <Dropdown menu={{ items: [deleteAction] }} trigger={['click']}>
          <DotsThreeIcon />
        </Dropdown>
      </Flex>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={itemIds}
          disabled={!reorderEnabled}
          strategy={verticalListSortingStrategy}
        >
          <Flex gap={token.paddingXS}>
            {tasks.map((ex) => {
              const taskId = workoutRowId.task(ex.task_id);

              return (
                <InnerSortableItem id={taskId} key={taskId}>
                  <ExerciseCard
                    id={taskId}
                    w={w}
                    ex={ex}
                    collapsible
                    collapsed
                    onClick={() => onExerciseClick(ex.task_id)}
                  />
                </InnerSortableItem>
              );
            })}
          </Flex>
        </SortableContext>
      </DndContext>
    </Flex>
  );
};

const InnerSortableItem = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const { setNodeRef, style } = useSortableList(id);

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};
