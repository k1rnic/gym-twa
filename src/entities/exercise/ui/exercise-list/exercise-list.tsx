import { Flex } from '@/shared/ui/flex';
import { XCircleIcon } from '@phosphor-icons/react';
import { Input } from 'antd';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExerciseFilter } from '../../lib/use-exercise-filter';
import { Exercise } from '../../model';
import { ExerciseGroup } from './exercise-group';

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
  searchPlaceholder,
  extra,
}: ExerciseListProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const grouped = useExerciseFilter(exercises, masterId, query);
  const resolvedPlaceholder =
    searchPlaceholder ?? t('exercise.searchPlaceholder');

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }} gap={8}>
      <Input
        allowClear={{ clearIcon: <XCircleIcon weight="fill" /> }}
        size="large"
        placeholder={resolvedPlaceholder}
        onChange={(e) => setQuery(e.target.value)}
      />
      {extra}
      <Flex height="100%" style={{ overflow: 'auto' }}>
        <ExerciseGroup
          title={t('exercise.my')}
          data={grouped.yours}
          onSelect={(ex) => onSelect?.(ex)}
        />
        <ExerciseGroup
          title={t('exercise.basic')}
          data={grouped.basic}
          onSelect={(ex) => onSelect?.(ex)}
        />
      </Flex>
    </Flex>
  );
};
