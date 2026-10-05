import { Flex } from '@/shared/ui/flex';
import { List, ListItem } from '@/shared/ui/list';
import { XCircleIcon } from '@phosphor-icons/react';
import { Checkbox, Input, Segmented } from 'antd';
import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExerciseFilter } from '../../lib/use-exercise-filter';
import { Exercise } from '../../model';
import { ExerciseAvatar } from '../exercise-avatar';

type Filter = 'basic' | 'yours';

const FILTERS = [
  { label: 'exercise.basic', value: 'basic' as const },
  { label: 'exercise.my', value: 'yours' as const },
];

export type ExerciseListProps = {
  exercises: Exercise[];
  masterId: number;
  onSelect?: (exercise: Exercise) => void;
  searchPlaceholder?: string;
  extra?: ReactNode;
  multiple?: boolean;
  selectedIds?: number[];
};

export const ExerciseList = ({
  exercises,
  masterId,
  onSelect,
  searchPlaceholder,
  extra,
  multiple = false,
  selectedIds,
}: ExerciseListProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('basic');
  const grouped = useExerciseFilter(exercises, masterId, query);
  const resolvedPlaceholder =
    searchPlaceholder ?? t('exercise.searchPlaceholder');

  const filtersLocalized = useMemo(
    () =>
      FILTERS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t],
  );

  const data = filter === 'basic' ? grouped.basic : grouped.yours;

  return (
    <Flex height="100%" style={{ overflow: 'hidden' }} gap={8}>
      <Input
        allowClear={{ clearIcon: <XCircleIcon weight="fill" /> }}
        size="large"
        placeholder={resolvedPlaceholder}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Segmented
        block
        options={filtersLocalized}
        value={filter}
        onChange={(value) => setFilter(value as Filter)}
      />
      {extra}
      <Flex height="100%" style={{ overflow: 'auto' }}>
        <List
          items={data}
          itemKey="exercise_id"
          variant="contained"
          emptyText={t('exercise.empty')}
          selectedKeys={multiple ? selectedIds : undefined}
          renderItem={(exercise) => (
            <ListItem
              nav={!multiple}
              avatar={<ExerciseAvatar exercise={exercise} size="large" />}
              header={exercise.exercise_name || t('common.unknownName')}
              extra={
                multiple ? (
                  <Checkbox
                    checked={Boolean(
                      exercise.exercise_id &&
                        selectedIds?.includes(exercise.exercise_id),
                    )}
                  />
                ) : undefined
              }
              onClick={() => onSelect?.(exercise)}
            />
          )}
        />
      </Flex>
    </Flex>
  );
};
