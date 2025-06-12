import { TaskWithExercise } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { ClockCircleOutlined, GoldOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';

const MetaItem = ({ icon, text }: { icon?: ReactNode; text: string }) => (
  <Space>
    {icon}
    {text}
  </Space>
);

export const ExerciseMetaDivider = () => <Divider type="vertical" />;

export const WeightInfo = ({
  min_weight,
  max_weight,
}: Pick<TaskWithExercise['properties'], 'min_weight' | 'max_weight'>) => (
  <MetaItem
    icon={<GoldOutlined />}
    text={`${min_weight ?? 0} - ${max_weight ?? 0} кг`}
  />
);

export const SetsXRepsInfo = ({
  sets,
  repeats,
}: Pick<TaskWithExercise['properties'], 'sets' | 'repeats'>) => (
  <MetaItem text={`${sets ?? 0} х ${repeats ?? 0}`} />
);

export const RestInfo = ({
  rest,
}: Pick<TaskWithExercise['properties'], 'rest'>) => (
  <MetaItem icon={<ClockCircleOutlined />} text={`${rest ?? 0} сек`} />
);

export const ExerciseMeta = ({ children }: PropsWithChildren) => (
  <Flex vertical={false} gap={4} justify="space-between" align="center">
    {children}
  </Flex>
);
