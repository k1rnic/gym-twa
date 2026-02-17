import { useToggle } from '@/shared/lib/hooks';
import { useCountDown } from '@/shared/ui/countdown/lib';
import { Flex } from '@/shared/ui/flex';
import { CaretRightOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';

export type CountDownDrawerProps = {
  disabled?: boolean;
  value: number;
};

export const CountDownDrawer = (props: CountDownDrawerProps) => {
  const [opened, toggle] = useToggle();
  const [countDownValue, setCountDownValue] = useState(props.value);

  const countdown = useCountDown(countDownValue);

  const close = () => {
    toggle();
    countdown.stop();
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
        color="primary"
        variant="filled"
        icon={<CaretRightOutlined />}
        disabled={props.disabled}
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
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
            <CloseOutlined onClick={close} />
          </Flex>
        }
        placement="bottom"
        closable={false}
        maskClosable={false}
        open={opened}
        styles={{
          header: { flexDirection: 'row-reverse' },
          content: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
        }}
      >
        <Flex height="100%" align="center" justify="center">
          <Typography.Text
            style={{ fontSize: 'clamp(96px, 10vw, 200px)', margin: 0 }}
          >
            {countdown.formatted}
          </Typography.Text>
        </Flex>
      </Drawer>
    </>
  );
};
