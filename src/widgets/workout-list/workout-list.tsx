import { workoutModel } from '@/entities/workout';
import { Api, TaskGroupStatus } from '@/shared/api';
import { CardList } from '@/shared/ui/card-list';
import { useEffect, useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';

import { FLOAT_BUTTON_SIZE } from '@/shared/ui/float-button';
import { WorkoutCard } from './workout-card';

type WorkoutListProps = {
  data: workoutModel.Workout[];
};

export const WorkoutList = ({ data }: WorkoutListProps) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [innerWorkouts, setInnerWorkouts] = useState(data);

  const handleReorder = async (reordered: workoutModel.Workout[]) => {
    setInnerWorkouts(reordered);

    try {
      await Api.taskGroup.reorderTaskGroup(
        reordered.map((w, idx) => ({
          task_group_id: w.task_group_id,
          order_idx: idx,
        })),
      );
    } catch (e) {
      console.error('Failed to reorder workouts', e);
    }

    revalidate();
  };

  const goToWorkoutDetails = (w: workoutModel.Workout) => {
    navigate(`${w.task_group_id}`);
  };

  useEffect(() => {
    setInnerWorkouts(data);
  }, [data]);

  return (
    <CardList
      reorderEnabled
      emptyText="Нет тренировок"
      items={innerWorkouts}
      itemKey="task_group_id"
      onReorder={handleReorder}
      renderItem={(w, itemProps, idx) => (
        <WorkoutCard
          {...itemProps}
          workout={w}
          collapsible
          collapsed={w.status !== TaskGroupStatus.Running}
          onClick={() => goToWorkoutDetails(w)}
          style={{
            marginBottom:
              idx === innerWorkouts.length - 1 ? FLOAT_BUTTON_SIZE : 0,
          }}
        />
      )}
    />
  );
};
