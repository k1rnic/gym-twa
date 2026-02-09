import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useMemo } from 'react';
import { useExercises } from '../model';

type Props = {
  masterId: number;
} & Pick<
  SelectProps<number>,
  'value' | 'onChange' | 'style' | 'styles' | 'disabled'
>;

export const ExerciseSelector = ({ masterId, ...selectProps }: Props) => {
  const exercises = useExercises(masterId);

  const options = useMemo(
    () =>
      exercises?.map<DefaultOptionType>(({ exercise_id, exercise_name }) => ({
        label: exercise_name,
        value: exercise_id,
      })) ?? [],
    [exercises],
  );

  useEffect(() => {}, []);

  return (
    <Select
      showSearch
      placeholder="Упражнение"
      optionFilterProp="label"
      options={options}
      {...selectProps}
    />
  );
};
