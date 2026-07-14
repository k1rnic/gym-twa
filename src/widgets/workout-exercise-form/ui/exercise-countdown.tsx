import { CountDown } from '@/shared/ui/countdown';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';

type Props = {
  hidden?: boolean;
  runEnabled: boolean;
};

export const ExerciseCountDown = ({ hidden = false, runEnabled }: Props) => {
  const { t } = useTranslation();

  return (
    <Form.Item
      hidden={hidden}
      name={['task_properties', 'rest']}
      style={{ margin: 0, width: '100%' }}
    >
      <CountDown runEnabled={runEnabled} placeholder={t('exercise.playRest')} />
    </Form.Item>
  );
};
