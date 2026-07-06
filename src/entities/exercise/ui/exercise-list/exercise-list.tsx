import { Flex } from '@/shared/ui/flex';
import { Input } from 'antd';
import { ReactNode, useState } from 'react';
import { useExerciseFilter } from '../../lib/use-exercise-filter';
import { Exercise } from '../../model';
import { ExerciseGroup } from './exercise-group';

const { Search } = Input;

export type ExerciseListProps = {
  exercises: Exercise[];
  masterId: number;
  onSelect?: (exercise: Exercise) => void;
  searchPlaceholder?: string;
  extra?: ReactNode;
};

export const ExerciseList = ({
  exercises,
  masterId,
  onSelect,
  searchPlaceholder = 'Поиск упражнений',
  extra,
}: ExerciseListProps) => {
  const [query, setQuery] = useState('');
  const grouped = useExerciseFilter(exercises, masterId, query);

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }} gap={8}>
      <Input
        allowClear
        size="large"
        placeholder={searchPlaceholder}
        onChange={(e) => setQuery(e.target.value)}
      />
      {extra}
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
    </Flex>
  );
};
