import { workoutModel } from '@/entities/workout';
import { useDeleteWorkoutGroupAction } from '@/features/delete-workout-group';
import { TaskGroupBlock, TaskGroupBlockType } from '@/shared/api';
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
import { DotsThreeIcon, PlusIcon } from '@phosphor-icons/react';
import { Dropdown, MenuProps, Typography } from 'antd';
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
  canModifyWorkout?: boolean;
  selectionMode?: boolean;
  onAddExercises: () => void;
  onInnerReorder: (from: number, to: number) => void;
  onExerciseClick: (taskId: workoutModel.WorkoutExercise['task_id']) => void;
};

export const WorkoutExerciseGroup = ({
  id,
  w,
  group,
  tasks,
  reorderEnabled,
  canModifyWorkout,
  selectionMode,
  onAddExercises,
  onInnerReorder,
  onExerciseClick,
}: WorkoutExerciseGroupProps) => {
  const { t } = useTranslation();
  const { token } = useTheme();
  const { setNodeRef, style, handler } = useSortableList(id);
  const deleteAction = useDeleteWorkoutGroupAction(
    w,
    group.task_group_block_id,
  );

  const addGroupExercisesAction: Required<MenuProps>['items'][number] =
    group.group_type === TaskGroupBlockType.Superset && canModifyWorkout
      ? {
          key: 'add-exercises',
          label: t('training.addExercises'),
          icon: <PlusIcon />,
          onClick: onAddExercises,
        }
      : null;

  const actions = [addGroupExercisesAction, deleteAction];

  const hasActions = Boolean(actions.filter(Boolean).length);

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
    <Flex ref={setNodeRef} gap={token.paddingXS} style={style}>
      <Flex
        vertical={false}
        align="center"
        justify="space-between"
        width="100%"
      >
        <Flex vertical={false} align="center" gap={token.paddingXS}>
          {handler}
          <Typography.Text strong>
            {t(`training.groupType.${group.group_type}`)}
          </Typography.Text>
        </Flex>

        <Flex vertical={false} align="center" gap={token.paddingXS}>
          {!selectionMode && hasActions && (
            <Dropdown menu={{ items: actions }} trigger={['click']}>
              <DotsThreeIcon />
            </Dropdown>
          )}
        </Flex>
      </Flex>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={itemIds}
          disabled={!reorderEnabled || selectionMode}
          strategy={verticalListSortingStrategy}
        >
          <Flex vertical={false} gap={6}>
            <Flex
              height="100%"
              style={{
                flexShrink: 0,
                borderLeft: `2px solid ${token.colorPrimary}`,
              }}
            />
            <Flex
              gap={token.paddingXS}
              width="100%"
              style={{ overflow: 'hidden' }}
            >
              {tasks.map((ex) => {
                const taskId = workoutRowId.task(ex.task_id);

                return (
                  <InnerSortableItem id={taskId} key={taskId}>
                    <ExerciseCard
                      id={taskId}
                      w={w}
                      ex={ex}
                      group={group}
                      groupTasks={tasks}
                      collapsible
                      collapsed
                      selectionMode={selectionMode}
                      onClick={
                        selectionMode
                          ? undefined
                          : () => onExerciseClick(ex.task_id)
                      }
                    />
                  </InnerSortableItem>
                );
              })}
            </Flex>
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
