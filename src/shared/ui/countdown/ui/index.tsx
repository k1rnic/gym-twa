import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { Divider } from 'antd';
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
  const { token } = useTheme();

  const countdown = useMemo(() => {
    const numeric = Number(inputProps.value);
    return Number.isFinite(numeric) ? numeric : 0;
  }, [inputProps.value]);

  return (
    <Flex
      vertical={false}
      align="center"
      p={token.paddingXS}
      style={{
        zIndex: 999,
        position: 'relative',
        backgroundColor: token.colorBgLayout,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Flex flex={1}>
        <CountDownInput {...inputProps} />
      </Flex>

      {runEnabled && <Divider type="vertical" style={{ height: '2em' }} />}

      {runEnabled && (
        <Flex flex={1} vertical={false}>
          <CountDownDrawer value={countdown} disabled={!countdown} />
        </Flex>
      )}
    </Flex>
  );
};
