import { CountDown } from '@/shared/ui/countdown';
import { Form } from 'antd';

type Props = {
  hidden?: boolean;
  runEnabled: boolean;
};

export const ExerciseCountDown = ({ hidden = false, runEnabled }: Props) => {
  return (
    <Form.Item
      hidden={hidden}
      name={['task_properties', 'rest']}
      style={{ margin: 0, width: '100%' }}
    >
      <CountDown runEnabled={runEnabled} placeholder="Отдых" />
    </Form.Item>
  );
};
