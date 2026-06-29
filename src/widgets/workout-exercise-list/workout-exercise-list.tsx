import { workoutModel } from '@/entities/workout';
import { Api, TaskAggregate } from '@/shared/api';
import { CardList } from '@/shared/ui/card-list';
import { useEffect, useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import { ExerciseCard } from './workout-exercise-card';

type WorkoutExerciseListProps = {
  w: workoutModel.Workout;
  data: workoutModel.WorkoutExercise[];
  reorderEnabled?: boolean;
};

export const WorkoutExerciseList = ({
  w,
  data,
  reorderEnabled,
}: WorkoutExerciseListProps) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [innerTasks, setInnerTasks] = useState(data);

  const handleReorder = async (reordered: TaskAggregate[]) => {
    setInnerTasks(reordered);

    try {
      await Api.task.reorderTask(
        reordered.map((t, idx) => ({ task_id: t.task_id, order_idx: idx })),
      );
    } catch (e) {
      console.error('Failed to reorder tasks', e);
    }

    revalidate();
  };

  const goToExercise = (id: workoutModel.WorkoutExercise['task_id']) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    setInnerTasks(data);
  }, [data]);

  return (
    <CardList
      reorderEnabled={reorderEnabled}
      showEmptyPlaceholder={false}
      items={innerTasks}
      itemKey="task_id"
      onReorder={handleReorder}
      renderItem={(ex, itemProps) => (
        <ExerciseCard
          {...itemProps}
          w={w}
          ex={ex}
          collapsible
          collapsed
          onClick={() => goToExercise(ex.task_id)}
        />
      )}
    />
  );
};
