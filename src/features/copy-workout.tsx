import { Api } from '@/shared/api';
import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react';
import { useRevalidator } from 'react-router';

export type CopyWorkoutButtonProps = {
  workoutId: number;
};

export const CopyWorkoutButton = (props: CopyWorkoutButtonProps) => {
  const { revalidate } = useRevalidator();

  const copyWorkout = async () => {
    await Api.taskGroup.copyTaskGroup(props.workoutId);
    revalidate();
  };

  return (
    <Button
      icon={<CopyOutlined />}
      onClick={copyWorkout}
      type="text"
      size="small"
    >
      Копировать
    </Button>
  );
};

export const useCopyWorkoutAction = (wId: number, key: string) => {
  const { revalidate } = useRevalidator();

  const copyWorkout = useCallback(async () => {
    await Api.taskGroup.copyTaskGroup(wId);
    revalidate();
  }, [wId]);

  return useMemo<Required<MenuProps>['items'][number]>(
    () => ({
      key,
      label: 'Дублировать',
      icon: <CopyOutlined />,
      onClick: copyWorkout,
    }),
    [key, copyWorkout],
  );
};
