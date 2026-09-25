import { workoutModel } from '@/entities/workout';
import { Api, TaskGroupBlock } from '@/shared/api';
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
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import {
  getRowId,
  moveInsideGroup,
  moveRows,
  toRows,
} from './lib/workout-order';
import { ExerciseCard } from './workout-exercise-card';
import { WorkoutExerciseGroup } from './workout-exercise-group';

type WorkoutExerciseListProps = {
  w: workoutModel.Workout;
  data: workoutModel.WorkoutExercise[];
  groups?: TaskGroupBlock[];
  reorderEnabled?: boolean;
};

export const WorkoutExerciseList = ({
  w,
  data,
  groups = [],
  reorderEnabled,
}: WorkoutExerciseListProps) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { token } = useTheme();

  const [innerTasks, setInnerTasks] = useState(data);

  const rows = useMemo(() => toRows(innerTasks, groups), [innerTasks, groups]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const itemIds = useMemo(
    () => rows.map((row) => ({ id: getRowId(row) })),
    [rows],
  );

  const persistReorder = async (next: workoutModel.WorkoutExercise[]) => {
    const previous = innerTasks;
    setInnerTasks(next);

    try {
      await Api.task.reorderTask(
        next.map((task, order_idx) => ({
          task_id: task.task_id,
          order_idx,
        })),
      );
    } catch (e) {
      console.error('Failed to reorder tasks', e);
      setInnerTasks(previous);
    }

    revalidate();
  };

  const handleOuterDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = itemIds.findIndex(({ id }) => id === active.id);
    const to = itemIds.findIndex(({ id }) => id === over.id);
    if (from === -1 || to === -1) return;

    persistReorder(moveRows(rows, from, to));
  };

  const handleInnerReorder = (blockId: number, from: number, to: number) => {
    persistReorder(moveInsideGroup(rows, blockId, from, to));
  };

  const goToExercise = (id: workoutModel.WorkoutExercise['task_id']) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    setInnerTasks(data);
  }, [data]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleOuterDragEnd}
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
          {rows.map((row) =>
            row.type === 'exercise' ? (
              <OuterSortableItem id={getRowId(row)} key={getRowId(row)}>
                <ExerciseCard
                  id={getRowId(row)}
                  w={w}
                  ex={row.task}
                  collapsible
                  collapsed
                  onClick={() => goToExercise(row.task.task_id)}
                />
              </OuterSortableItem>
            ) : (
              <WorkoutExerciseGroup
                key={getRowId(row)}
                id={getRowId(row)}
                w={w}
                group={row.group}
                tasks={row.tasks}
                reorderEnabled={reorderEnabled}
                onInnerReorder={(from, to) =>
                  handleInnerReorder(row.group.task_group_block_id, from, to)
                }
                onExerciseClick={goToExercise}
              />
            ),
          )}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

const OuterSortableItem = ({
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
