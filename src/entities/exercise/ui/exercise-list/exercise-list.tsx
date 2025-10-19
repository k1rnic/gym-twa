import { Flex } from '@/shared/ui/flex';
import { Empty, Input, Typography } from 'antd';
import { useState } from 'react';
import { useExerciseFilter } from '../../lib/use-exercise-filter';
import { Exercise } from '../../model';
import { ExerciseGroup } from './exercise-group';

const { Search } = Input;
const { Text } = Typography;

export interface ExerciseListProps {
  exercises: Exercise[];
  masterId: number;
  onSelect?: (exercise: Exercise) => void;
  searchPlaceholder?: string;
}

export const ExerciseList = ({
  exercises,
  masterId,
  onSelect,
  searchPlaceholder = 'Поиск упражнений',
}: ExerciseListProps) => {
  const [query, setQuery] = useState('');
  const grouped = useExerciseFilter(exercises, masterId, query);

  const hasData = grouped.yours.length > 0 || grouped.basic.length > 0;

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }} gap={8}>
      <Search
        allowClear
        size="middle"
        placeholder={searchPlaceholder}
        onChange={(e) => setQuery(e.target.value)}
      />

      {hasData ? (
        <Flex height="100%" style={{ overflow: 'auto' }}>
          <ExerciseGroup
            title="Мои"
            data={grouped.yours}
            onSelect={(ex) => onSelect?.(ex)}
          />
          <ExerciseGroup
            title="Базовые"
            data={grouped.basic}
            onSelect={(ex) => onSelect?.(ex)}
          />
        </Flex>
      ) : (
        <Empty description={<Text type="secondary">нет упражнений</Text>} />
      )}
    </Flex>
  );
};
