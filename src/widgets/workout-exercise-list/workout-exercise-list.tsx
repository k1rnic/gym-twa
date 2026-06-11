import { exerciseModel } from '@/entities/exercise';
import { Api, TaskAggregate } from '@/shared/api';
import { CardList } from '@/shared/ui/card-list';
import { FLOAT_BUTTON_SIZE } from '@/shared/ui/float-button';
import { useEffect, useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router';
import { ExerciseCard } from './workout-exercise-card';

type WorkoutExerciseListProps = {
  data: exerciseModel.ExerciseInstance[];
  readonly?: boolean;
};

export const WorkoutExerciseList = ({
  data,
  readonly = false,
}: WorkoutExerciseListProps) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [innerTasks, setInnerTasks] = useState(data);

  const handleReorder = async (reordered: TaskAggregate[]) => {
    setInnerTasks(reordered);

    try {
      await Api.task.reorderTask(
        reordered.map((t, idx) => ({
          task_id: t.task_id,
          order_idx: idx,
        })),
      );
    } catch (e) {
      console.error('Failed to reorder tasks', e);
    }

    revalidate();
  };

  const goToExercise = (id: exerciseModel.ExerciseInstance['task_id']) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    setInnerTasks(data);
  }, [data]);

  return (
    <CardList
      reorderEnabled
      emptyText="Нет упражнений"
      items={innerTasks}
      itemKey="task_id"
      onReorder={handleReorder}
      renderItem={(ex, itemProps, idx) => (
        <ExerciseCard
          {...itemProps}
          ex={ex}
          collapsible
          collapsed
          readonly={readonly}
          onClick={() => goToExercise(ex.task_id)}
          style={{
            marginBottom: idx === innerTasks.length - 1 ? FLOAT_BUTTON_SIZE : 0,
          }}
        />
      )}
    />
  );
};
