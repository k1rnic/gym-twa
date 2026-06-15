import { workoutModel } from '@/entities/workout';
import { Api } from '@/shared/api';
import { CopyOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/interface';
import { useCallback, useMemo } from 'react';
import { useRevalidator } from 'react-router';

export const useCopyWorkoutAction = (w: workoutModel.Workout, key: string) => {
  const { revalidate } = useRevalidator();

  const copyWorkout = useCallback(async () => {
    try {
      await Api.taskGroup.copyTaskGroup(w.task_group_id);
      revalidate();
    } catch (e) {
      console.error(e);
    }
  }, [w.task_group_id]);

  return useMemo<ItemType>(
    () => ({
      key,
      label: 'Дублировать',
      icon: <CopyOutlined />,
      onClick: copyWorkout,
    }),
    [key, copyWorkout],
  );
};
