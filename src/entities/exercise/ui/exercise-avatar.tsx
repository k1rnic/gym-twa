import { useTheme } from '@/shared/lib/theme';
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';
import { useMemo } from 'react';
import { Exercise } from '../model';

type ExerciseAvatarProps = {
  size?: AvatarSize;
  exercise?: Exercise;
};

export const ExerciseAvatar = ({
  size = 'default',
  exercise,
}: ExerciseAvatarProps) => {
  const { token } = useTheme();

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
        backgroundColor: token.colorSplit,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      src={src}
    />
  );
};
