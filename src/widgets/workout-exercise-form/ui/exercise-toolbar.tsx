import { CountDown } from '@/shared/ui/countdown';
import { Form } from 'antd';

type Props = {
  visible: boolean;
  runEnabled: boolean;
};

export const ExerciseToolbar = ({ visible, runEnabled }: Props) => {
  if (!visible) return null;

  return (
    <Form.Item
      name={['task_properties', 'rest']}
      style={{ margin: 0, width: '100%' }}
    >
      <CountDown runEnabled={runEnabled} placeholder="Отдых" />
    </Form.Item>
  );
};
