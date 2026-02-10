import { Api } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Exercise, useExercises } from '../model';

type Props = {
  masterId: number;
} & Pick<
  SelectProps<number>,
  'value' | 'onChange' | 'style' | 'styles' | 'disabled'
>;

export const ExerciseSelector = ({ masterId, ...selectProps }: Props) => {
  const exercises = useExercises(masterId);

  const navigate = useNavigate();

  const options = useMemo(
    () =>
      exercises?.map<DefaultOptionType>(({ exercise_id, exercise_name }) => ({
        label: exercise_name,
        value: exercise_id,
      })) ?? [],
    [exercises],
  );

  const goToExercise = (ex: Exercise) => {
    navigate(`/exercises/${ex.exercise_id}`);
  };

  const createExercise = async () => {
    const ex = await Api.exercise.createExercise({
      master_id: masterId,
      exercise_name: '',
      description: '',
      link_ids: [],
    });
    goToExercise(ex);
  };

  return (
    <Select
      showSearch
      virtual={false}
      placeholder="Упражнение"
      optionFilterProp="label"
      options={options}
      popupRender={(menu) => (
        <Flex style={{ maxHeight: '40vh' }}>
          <Flex flex={1} style={{ overflowY: 'auto' }}>
            {menu}
          </Flex>

          <Divider style={{ margin: '8px 0' }} />
          <Button
            block
            variant="filled"
            color="primary"
            icon={<PlusOutlined />}
            onClick={createExercise}
            style={{ flexShrink: 0 }}
          >
            Добавить шаблон
          </Button>
        </Flex>
      )}
      {...selectProps}
    />
  );
};
