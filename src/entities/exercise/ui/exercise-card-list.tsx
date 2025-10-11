import { TaskAggregate } from '@/shared/api-v2';
import { List } from 'antd';
import { ListProps } from 'antd/lib/list';

export type ExerciseCardListProps = {
  // FIXME: replace with exerciseModel.ExerciseInstance
  exercises: TaskAggregate[];
} & Pick<ListProps<TaskAggregate>, 'renderItem'>;

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
