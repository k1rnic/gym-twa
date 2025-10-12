import { exerciseModel } from '@/entities/exercise';
import { List, Typography } from 'antd';
import { ListItemMetaProps } from 'antd/lib/list';

export type ExerciseCardBaseProps = {
  ex: exerciseModel.ExerciseInstance;
  onTitleClick?: () => void;
} & Pick<ListItemMetaProps, 'description'>;

export const ExerciseCardBase = ({
  // ex,
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
            {/* FIXME: update name here */}
            {/* {ex.exercise_name} */}
          </TitleComponent>
        }
        description={description}
      />
    </List.Item>
  );
};
