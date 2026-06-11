import { Api } from '@/shared/api';
import { DeleteOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react';
import { useRevalidator } from 'react-router';

export const useDeleteExerciseInstanceAction = (
  taskId: number,
  key: string,
) => {
  const { revalidate } = useRevalidator();

  const deleteExerciseInstance = useCallback(async () => {
    try {
      await Api.task.deleteTask(taskId);
    } finally {
      revalidate();
    }
  }, [taskId]);

  return useMemo<Required<MenuProps>['items'][number]>(
    () => ({
      key,
      label: 'Удалить',
      icon: <DeleteOutlined />,
      onClick: deleteExerciseInstance,
    }),
    [key, deleteExerciseInstance],
  );
};
