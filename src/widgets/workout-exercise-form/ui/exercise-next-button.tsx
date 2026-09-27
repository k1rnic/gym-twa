import { ArrowRightIcon, CaretRightIcon } from '@phosphor-icons/react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

type Props = {
  hidden?: boolean;
  onClick: () => void;
};

export const ExerciseNextButton = ({ hidden = false, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <Button
      size="small"
      type="primary"
      hidden={hidden}
      icon={<CaretRightIcon />}
      iconPosition="end"
      onClick={onClick}
    >
      {t('exercise.nextExercise')}
    </Button>
  );
};
