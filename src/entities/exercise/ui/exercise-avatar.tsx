import { exerciseModel } from '@/entities/exercise';
import { Avatar } from 'antd';
import { useMemo } from 'react';

type ExerciseAvatarProps = {
  size?: number;
  exercise?: exerciseModel.Exercise;
};

export const ExerciseAvatar = ({
  size = 50,
  exercise,
}: ExerciseAvatarProps) => {
  const src = useMemo(
    () =>
      exercise?.url_path_list?.find((e) => e.url_path_type === 'image')
        ?.url_path,
    [exercise],
  );

  return (
    <Avatar
      shape="square"
      size={size}
      style={{
        flexShrink: 0,
        backgroundColor: '#f0f0f0',
        color: '#888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      src={src}
    />
  );
};
