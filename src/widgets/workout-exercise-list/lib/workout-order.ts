import { workoutModel } from '@/entities/workout';
import { TaskGroupBlock, TaskGroupBlockType } from '@/shared/api';

export type WorkoutRow =
  | { type: 'exercise'; task: workoutModel.WorkoutExercise }
  | {
      type: 'group';
      group: TaskGroupBlock;
      tasks: workoutModel.WorkoutExercise[];
    };

export const workoutRowId = {
  exercise: (taskId: number) => `row:task:${taskId}`,
  group: (blockId: number) => `row:group:${blockId}`,
  task: (taskId: number) => `task:${taskId}`,
};

export const getRowId = (row: WorkoutRow) =>
  row.type === 'exercise'
    ? workoutRowId.exercise(row.task.task_id)
    : workoutRowId.group(row.group.task_group_block_id);

const sortTasks = (tasks: workoutModel.WorkoutExercise[]) =>
  [...tasks].sort((a, b) => {
    const order = (a.order_idx ?? 0) - (b.order_idx ?? 0);
    return order !== 0 ? order : a.task_id - b.task_id;
  });

const moveItem = <T>(items: T[], from: number, to: number) => {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const stubGroup = (
  blockId: number,
  task: workoutModel.WorkoutExercise,
  members: workoutModel.WorkoutExercise[],
): TaskGroupBlock => ({
  task_group_block_id: blockId,
  task_group_id: task.task_group_id,
  group_type: TaskGroupBlockType.Superset,
  task_ids: members.map((member) => member.task_id),
});

export const toRows = (
  tasks: workoutModel.WorkoutExercise[],
  groups: TaskGroupBlock[] = [],
): WorkoutRow[] => {
  const groupById = new Map(
    groups.map((group) => [group.task_group_block_id, group]),
  );
  const membersByBlock = new Map<number, workoutModel.WorkoutExercise[]>();
  const sorted = sortTasks(tasks);

  for (const task of sorted) {
    const blockId = task.task_group_block_id;
    if (blockId == null) continue;

    const members = membersByBlock.get(blockId) ?? [];
    members.push(task);
    membersByBlock.set(blockId, members);
  }

  const consumed = new Set<number>();
  const rows: WorkoutRow[] = [];

  for (const task of sorted) {
    if (consumed.has(task.task_id)) continue;

    const blockId = task.task_group_block_id;
    if (blockId == null) {
      rows.push({ type: 'exercise', task });
      consumed.add(task.task_id);
      continue;
    }

    const members = membersByBlock.get(blockId) ?? [task];
    for (const member of members) {
      consumed.add(member.task_id);
    }

    rows.push({
      type: 'group',
      group: groupById.get(blockId) ?? stubGroup(blockId, task, members),
      tasks: members,
    });
  }

  return rows;
};

export const flatten = (rows: WorkoutRow[]): workoutModel.WorkoutExercise[] =>
  rows
    .flatMap((row) => (row.type === 'exercise' ? [row.task] : row.tasks))
    .map((task, order_idx) => ({ ...task, order_idx }));

export const moveRows = (rows: WorkoutRow[], from: number, to: number) =>
  flatten(moveItem(rows, from, to));

export const moveInsideGroup = (
  rows: WorkoutRow[],
  blockId: number,
  from: number,
  to: number,
) =>
  flatten(
    rows.map((row) =>
      row.type === 'group' && row.group.task_group_block_id === blockId
        ? { ...row, tasks: moveItem(row.tasks, from, to) }
        : row,
    ),
  );

export const moveTasksAfterGroup = (
  tasks: workoutModel.WorkoutExercise[],
  blockId: number,
  taskIds: number[],
) => {
  const movingIds = new Set(taskIds);
  const sorted = sortTasks(tasks);
  const moving = sorted.filter((task) => movingIds.has(task.task_id));
  const remaining = sorted.filter((task) => !movingIds.has(task.task_id));
  const lastGroupTaskIndex = remaining.reduce(
    (lastIndex, task, index) =>
      task.task_group_block_id === blockId ? index : lastIndex,
    -1,
  );

  if (!moving.length || lastGroupTaskIndex < 0) return tasks;

  remaining.splice(lastGroupTaskIndex + 1, 0, ...moving);
  return remaining.map((task, order_idx) => ({ ...task, order_idx }));
};
