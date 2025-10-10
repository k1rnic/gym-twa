import { exerciseModel } from '@/entities/exercise';
import { Flex } from '@/shared/ui/flex';
import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib';

export type SetRepListFieldProps = {
  exercise: exerciseModel.ExerciseInstance;
  inputProps?: Omit<InputNumberProps, 'onChange'>;
  onChange?: (value: number | null, idx: number) => void;
};

export const SetRepListField = ({
  exercise: { properties },
  inputProps,
  onChange,
}: SetRepListFieldProps) => {
  return (
    <Flex vertical={false} gap={8} style={{ overflow: 'auto' }}>
      {Array.from({ length: properties.sets ?? 0 }, (_, idx) => (
        <InputNumber
          key={idx}
          style={{ width: 48, flexShrink: 0 }}
          value={properties.values?.at(idx)?.value ?? null}
          onChange={(value) => onChange?.(value as number, idx)}
          {...inputProps}
        />
      ))}
    </Flex>
  );
};
