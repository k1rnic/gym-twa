import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useMemo } from 'react';
import { useExerciseDescriptions } from '../model';

type Props = {
  exerciseId?: number;
} & Pick<SelectProps<number>, 'value' | 'onChange'>;

export const ExerciseDescriptionSelector = ({
  exerciseId,
  ...selectProps
}: Props) => {
  const descriptions = useExerciseDescriptions(exerciseId);

  const options = useMemo(
    () =>
      descriptions?.map<DefaultOptionType>(
        ({ exercise_desc_id, description }) => ({
          label: description,
          value: exercise_desc_id,
        }),
      ) ?? [],
    [descriptions],
  );

  useEffect(() => {}, []);

  return (
    <Select
      showSearch
      placeholder="Выбрать описание"
      optionFilterProp="label"
      options={options}
      {...selectProps}
    />
  );
};
