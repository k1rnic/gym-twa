import { Flex } from '@/shared/ui/flex';
import { useMemo } from 'react';
import { CountDownDrawer } from './drawer';
import { CountDownInput, CountDownInputProps } from './input';

export type CountDownProps = {
  runEnabled?: boolean;
} & CountDownInputProps;

export const CountDown = ({
  runEnabled = true,
  ...inputProps
}: CountDownProps) => {
  const countdown = useMemo(() => {
    const numeric = Number(inputProps.value);
    return Number.isFinite(numeric) ? numeric : 0;
  }, [inputProps.value]);

  return (
    <Flex vertical={false}>
      <CountDownInput {...inputProps} runEnabled={runEnabled} />
      {runEnabled && (
        <CountDownDrawer value={countdown} disabled={!countdown} />
      )}
    </Flex>
  );
};
