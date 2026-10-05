import { workoutModel } from '@/entities/workout';
import { useTheme } from '@/shared/lib/theme';
import { CardList } from '@/shared/ui/card-list';
import { FLOAT_BUTTON_SIZE } from '@/shared/ui/float-button';

import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { groupWorkoutsByMonth } from './lib/group-by-month';
import { MonthGroupHeader } from './month-group-header';
import { WorkoutCard } from './workout-card';

type WorkoutArchiveRow =
  | { type: 'header'; key: string; date: Date | null }
  | { type: 'workout'; key: string; workout: workoutModel.Workout };

type WorkoutArchiveProps = {
  data: workoutModel.Workout[];
};

export const WorkoutArchive = ({ data }: WorkoutArchiveProps) => {
  const { token } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const headerStyle = useMemo<CSSProperties>(
    () => ({
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: token.colorBgContainer,
    }),
    [token.colorBgContainer],
  );

  const { rows, lastWorkoutKey } = useMemo(() => {
    const result: WorkoutArchiveRow[] = [];
    let lastWorkout = '';

    for (const group of groupWorkoutsByMonth(data)) {
      result.push({
        type: 'header',
        key: `header:${group.key}`,
        date: group.date,
      });

      for (const workout of group.workouts) {
        lastWorkout = `workout:${workout.task_group_id}`;
        result.push({ type: 'workout', key: lastWorkout, workout });
      }
    }

    return { rows: result, lastWorkoutKey: lastWorkout };
  }, [data]);

  return (
    <CardList
      emptyText={t('training.empty')}
      items={rows}
      itemKey="key"
      isSection={(row) => row.type === 'header'}
      renderItem={(row, { id }) =>
        row.type === 'header' ? (
          <MonthGroupHeader date={row.date} style={headerStyle} />
        ) : (
          <WorkoutCard
            id={id}
            workout={row.workout}
            collapsible
            showFinishedAt
            onClick={() => navigate(`${row.workout.task_group_id}`)}
            style={
              row.key === lastWorkoutKey
                ? { marginBottom: FLOAT_BUTTON_SIZE }
                : undefined
            }
          />
        )
      }
    />
  );
};
