import { useToggle } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { useCountDown } from '@/shared/ui/countdown/lib';
import { Flex } from '@/shared/ui/flex';
import { PlayIcon, XIcon } from '@phosphor-icons/react';
import { Button, Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  progress: number;
  children?: React.ReactNode;
};

export const CircularProgress = ({ progress, children }: Props) => {
  const { token } = useTheme();

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={token.colorBgBlur}
          strokeWidth="2"
        />

        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={token.colorPrimary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <Flex
        align="center"
        justify="center"
        style={{ position: 'absolute', inset: 0 }}
      >
        {children}
      </Flex>
    </div>
  );
};

export type CountDownDrawerProps = {
  disabled?: boolean;
  value: number;
};

export const CountDownDrawer = (props: CountDownDrawerProps) => {
  const { token } = useTheme();

  const [opened, toggle] = useToggle();
  const [countDownValue, setCountDownValue] = useState(props.value);

  const countdown = useCountDown(countDownValue);

  const close = () => {
    toggle();
    countdown.stop();
  };

  const restart = () => {
    countdown.reset();
    countdown.start();
  };

  useEffect(() => {
    setCountDownValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (opened) {
      countdown.reset();
      countdown.start();
    }
  }, [opened]);

  return (
    <>
      <Button
        block
        size="middle"
        type="primary"
        icon={<PlayIcon weight="fill" size={18} />}
        disabled={props.disabled}
        onClick={close}
      >
        Запуск
      </Button>

      <Drawer
        title={
          <Flex
            vertical={false}
            justify="space-between"
            style={{ textAlign: 'center' }}
          >
            <Typography.Title level={3} style={{ margin: 0, flex: 1 }}>
              Таймер
            </Typography.Title>
            <XIcon onClick={close} />
          </Flex>
        }
        height="70vh"
        placement="bottom"
        open={opened}
        closable={false}
        maskClosable
        onClose={close}
        styles={{ body: { paddingTop: 0 } }}
      >
        <Flex height="100%" width="100%" style={{ overflow: 'hidden' }}>
          <CircularProgress progress={1 - countdown.remaining / countDownValue}>
            <Flex style={{ alignItems: 'center' }}>
              <Typography.Text
                style={{
                  fontSize: 'clamp(96px, 10vw, 200px)',
                  margin: 0,
                  flex: 1,
                }}
              >
                {countdown.formatted}
              </Typography.Text>
            </Flex>
          </CircularProgress>
          <Button block size="large" type="primary" onClick={restart}>
            Перезапуск
          </Button>
        </Flex>
      </Drawer>
    </>
  );
};
