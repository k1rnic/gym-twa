import { TaskWithExercise } from '@/shared/api';
import { List } from 'antd';
import { ListProps } from 'antd/lib/list';

export type ExerciseCardListProps = {
  exercises: TaskWithExercise[];
} & Pick<ListProps<TaskWithExercise>, 'renderItem'>;

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
