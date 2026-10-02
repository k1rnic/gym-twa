import { workoutModel } from '@/entities/workout';
import { CreateWorkoutExerciseButton } from '@/features/create-exercise-instance';
import { applyWorkoutGroupRest } from '@/features/sync-workout-group-rest';
import { Api, TaskGroupBlock, TaskGroupBlockType } from '@/shared/api';
import { useSortableList } from '@/shared/lib/hooks';
import { message } from '@/shared/lib/message';
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
import { DotsThreeIcon, LinkIcon } from '@phosphor-icons/react';
import { Button, Dropdown, Space, Typography } from 'antd';
import { MenuProps } from 'antd/lib';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useRevalidator } from 'react-router';
import {
  getRowId,
  moveInsideGroup,
  moveRows,
  moveTasksAfterGroup,
  toRows,
} from './lib/workout-order';
import { ExerciseCard } from './workout-exercise-card';
import { WorkoutExerciseGroup } from './workout-exercise-group';

type WorkoutExerciseListProps = {
  w: workoutModel.Workout;
  data: workoutModel.WorkoutExercise[];
  groups?: TaskGroupBlock[];
  reorderEnabled?: boolean;
  canModifyWorkout?: boolean;
};

type SelectionMode = { type: 'create' } | { type: 'add'; groupId: number };

export const WorkoutExerciseList = ({
  w,
  data,
  groups = [],
  reorderEnabled,
  canModifyWorkout,
}: WorkoutExerciseListProps) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { token } = useTheme();
  const { t } = useTranslation();

  const [innerTasks, setInnerTasks] = useState(data);
  const [selectionMode, setSelectionMode] = useState<SelectionMode | null>(
    null,
  );
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

  const rows = useMemo(() => toRows(innerTasks, groups), [innerTasks, groups]);
  const visibleRows = useMemo(
    () =>
      selectionMode ? rows.filter((row) => row.type === 'exercise') : rows,
    [rows, selectionMode],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const itemIds = useMemo(
    () => visibleRows.map((row) => ({ id: getRowId(row) })),
    [visibleRows],
  );

  const groupName =
    selectionMode?.type === 'add'
      ? t(
          `training.groupType.${
            groups.find(
              (group) => group.task_group_block_id === selectionMode.groupId,
            )?.group_type ?? TaskGroupBlockType.Superset
          }`,
        )
      : '';
  const minSelection = selectionMode?.type === 'create' ? 2 : 1;
  const availableExerciseCount = rows.filter(
    (row) => row.type === 'exercise',
  ).length;

  const workoutActions = useMemo<Required<MenuProps>['items']>(() => {
    const actions: Required<MenuProps>['items'] = [];

    if (!canModifyWorkout) return [];
    if (availableExerciseCount >= 2) {
      actions.push({
        key: 'create-superset',
        label: t('training.groupExercises'),
        icon: <LinkIcon />,
        onClick: () => startSelection({ type: 'create' }),
      });
    }
    return actions;
  }, [canModifyWorkout, availableExerciseCount]);

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

  const startSelection = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedTaskIds([]);
  };

  const cancelSelection = () => {
    setSelectionMode(null);
    setSelectedTaskIds([]);
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  };

  const applyGroupRest = async (groupTasks: workoutModel.WorkoutExercise[]) => {
    try {
      await applyWorkoutGroupRest(groupTasks);
    } catch (error) {
      console.error('Failed to apply group rest', error);
      message.warning(t('training.groupRestNotApplied'));
    }
  };

  const confirmSelection = async () => {
    if (!selectionMode) return;

    const minSelection = selectionMode.type === 'create' ? 2 : 1;
    if (selectedTaskIds.length < minSelection) return;

    const selectedTasks = rows.flatMap((row) =>
      row.type === 'exercise' && selectedTaskIds.includes(row.task.task_id)
        ? [row.task]
        : [],
    );

    try {
      if (selectionMode.type === 'create') {
        await Api.taskGroupBlock.createTaskGroupBlock({
          task_ids: selectedTaskIds,
          group_type: TaskGroupBlockType.Superset,
        });

        await applyGroupRest(selectedTasks);
      } else {
        const group = groups.find(
          (item) => item.task_group_block_id === selectionMode.groupId,
        );
        if (!group) {
          message.error(t('training.groupNotFound'));
          cancelSelection();
          return;
        }

        const groupTaskIds = new Set([
          ...(group.task_ids ?? []),
          ...innerTasks
            .filter(
              (task) => task.task_group_block_id === selectionMode.groupId,
            )
            .map((task) => task.task_id),
          ...selectedTaskIds,
        ]);
        await Api.taskGroupBlock.updateTaskGroupBlock(selectionMode.groupId, {
          group_type: group.group_type,
          task_ids: [...groupTaskIds],
        });

        const reordered = moveTasksAfterGroup(
          innerTasks,
          selectionMode.groupId,
          selectedTaskIds,
        );
        if (reordered !== innerTasks) {
          try {
            await Api.task.reorderTask(
              reordered.map((task, order_idx) => ({
                task_id: task.task_id,
                order_idx,
              })),
            );
          } catch (error) {
            console.error('Failed to preserve group position', error);
            message.warning(t('training.groupPositionNotPreserved'));
          }
        }

        const groupTasks = rows.flatMap((row) =>
          row.type === 'group' &&
          row.group.task_group_block_id === selectionMode.groupId
            ? row.tasks
            : [],
        );

        await applyGroupRest([...groupTasks, ...selectedTasks]);
      }

      cancelSelection();
      revalidate();
    } catch (error) {
      console.error('Failed to update superset', error);
      message.error(t('training.groupUpdateFailed'));
    }
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
        disabled={!reorderEnabled || Boolean(selectionMode)}
        strategy={verticalListSortingStrategy}
      >
        <Flex
          gap={token.paddingSM}
          style={{ height: '100%', minHeight: 0, overflow: 'hidden' }}
        >
          {selectionMode ? (
            <Flex gap={token.padding}>
              <Flex gap={token.paddingSM} vertical={false}>
                <Button
                  block
                  type="primary"
                  disabled={selectedTaskIds.length < minSelection}
                  onClick={confirmSelection}
                >
                  {t('training.groupExercises')}
                </Button>
                <Button danger onClick={cancelSelection}>
                  {t('common.cancel')}
                </Button>
              </Flex>

              <Typography.Text type="secondary">
                {t('training.selectForSuperset')}
              </Typography.Text>
            </Flex>
          ) : (
            <Space.Compact>
              <CreateWorkoutExerciseButton workout={w} />
              {workoutActions.length ? (
                <Dropdown
                  menu={{ items: workoutActions }}
                  placement="bottomRight"
                >
                  <Button icon={<DotsThreeIcon />} />
                </Dropdown>
              ) : null}
            </Space.Compact>
          )}

          <Flex
            vertical
            flex={1}
            gap={token.paddingXS}
            style={{ minHeight: 0, overflowY: 'auto' }}
          >
            {selectionMode && availableExerciseCount === 0 ? (
              <Typography.Text type="secondary">
                {t('training.noExercisesToSelect')}
              </Typography.Text>
            ) : (
              visibleRows.map((row) =>
                row.type === 'exercise' ? (
                  <OuterSortableItem id={getRowId(row)} key={getRowId(row)}>
                    <ExerciseCard
                      id={getRowId(row)}
                      w={w}
                      ex={row.task}
                      collapsible
                      collapsed
                      selectionMode={Boolean(selectionMode)}
                      selected={selectedTaskIds.includes(row.task.task_id)}
                      onClick={() =>
                        selectionMode
                          ? toggleTaskSelection(row.task.task_id)
                          : goToExercise(row.task.task_id)
                      }
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
                    canModifyWorkout={canModifyWorkout}
                    selectionMode={Boolean(selectionMode)}
                    onAddExercises={() =>
                      startSelection({
                        type: 'add',
                        groupId: row.group.task_group_block_id,
                      })
                    }
                    onInnerReorder={(from, to) =>
                      handleInnerReorder(
                        row.group.task_group_block_id,
                        from,
                        to,
                      )
                    }
                    onExerciseClick={goToExercise}
                  />
                ),
              )
            )}
          </Flex>
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
