import { workoutModel } from '@/entities/workout';

export const UNKNOWN_MONTH_KEY = 'unknown';

export type WorkoutMonthGroup = {
  key: string;
  date: Date | null;
  workouts: workoutModel.Workout[];
};

export const resolveWorkoutDate = (
  workout: workoutModel.Workout,
): Date | null => {
  const raw = workout.update_dttm || workout.create_dttm;
  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
};

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const toTimestamp = (date: Date | null) => date?.getTime() ?? -Infinity;

type PendingGroup = {
  key: string;
  date: Date | null;
  entries: { workout: workoutModel.Workout; timestamp: number }[];
};

export const groupWorkoutsByMonth = (
  workouts: workoutModel.Workout[],
): WorkoutMonthGroup[] => {
  const groups = new Map<string, PendingGroup>();

  for (const workout of workouts) {
    const date = resolveWorkoutDate(workout);
    const key = date ? monthKey(date) : UNKNOWN_MONTH_KEY;
    const entry = { workout, timestamp: toTimestamp(date) };
    const group = groups.get(key);

    if (group) {
      group.entries.push(entry);
    } else {
      groups.set(key, { key, date, entries: [entry] });
    }
  }

  return [...groups.values()]
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
    .map((group) => ({
      key: group.key,
      date: group.date,
      workouts: group.entries
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(({ workout }) => workout),
    }));
};
