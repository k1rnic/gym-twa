import { TaskWithExercise } from '@/shared/api';
import { List, Typography } from 'antd';
import { ListItemMetaProps } from 'antd/lib/list';

export type ExerciseCardBaseProps = {
  ex: TaskWithExercise;
  onTitleClick?: () => void;
} & Pick<ListItemMetaProps, 'description'>;

export const ExerciseCardBase = ({
  ex,
  description,
  onTitleClick,
}: ExerciseCardBaseProps) => {
  const TitleComponent = onTitleClick ? Typography.Link : Typography.Text;

  return (
    <List.Item>
      <List.Item.Meta
        style={{ marginBlockEnd: 0 }}
        title={
          <TitleComponent onClick={onTitleClick}>
            {ex.exercise_desc.exercise.title}
          </TitleComponent>
        }
        description={description}
      />
    </List.Item>
  );
};
