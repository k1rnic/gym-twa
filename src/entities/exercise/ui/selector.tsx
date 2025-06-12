import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useMemo } from 'react';
import { useExercises } from '../model';

type Props = {
  masterId: number;
} & Pick<SelectProps<number>, 'value' | 'onChange' | 'style' | 'styles'>;

export const ExerciseSelector = ({ masterId, ...selectProps }: Props) => {
  const exercises = useExercises(masterId);

  const options = useMemo(
    () =>
      exercises?.map<DefaultOptionType>(({ exercise_id, title }) => ({
        label: title,
        value: exercise_id,
      })) ?? [],
    [exercises],
  );

  useEffect(() => {}, []);

  return (
    <Select
      showSearch
      placeholder="Выбрать упражнение"
      optionFilterProp="label"
      options={options}
      {...selectProps}
    />
  );
};
