import { exerciseModel } from '@/entities/exercise';
import { List } from 'antd';
import { ListProps } from 'antd/lib/list';

export type ExerciseCardListProps = {
  exercises: exerciseModel.ExerciseInstance[];
} & Pick<ListProps<exerciseModel.ExerciseInstance>, 'renderItem'>;

export const ExerciseCardList = ({
  exercises,
  renderItem,
}: ExerciseCardListProps) => {
  return (
    <List
      dataSource={exercises}
      itemLayout="vertical"
      locale={{ emptyText: 'Нет упражнений' }}
      renderItem={renderItem}
    />
  );
};
