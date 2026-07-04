import { ExerciseAvatar, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select, SelectProps, Typography } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

type Props = Pick<
  SelectProps<number>,
  'value' | 'onChange' | 'style' | 'styles' | 'disabled'
>;

export const ExerciseSelector = ({ ...selectProps }: Props) => {
  const navigate = useNavigate();

  const { master } = viewerModel.useViewer();

  const masterId = master!.master_id!;

  const { data: exercises } = exerciseModel.useExercises(masterId);

  const exerciseMap = useMemo(
    () => exercises.reduce((acc, ex) => acc.set(ex.exercise_id, ex), new Map()),
    [exercises],
  );

  const options = useMemo(
    () =>
      Array.from(exerciseMap.values()).map((ex) => ({
        label: ex.exercise_name,
        value: ex.exercise_id,
      })),
    [exerciseMap],
  );

  const goToExercise = (ex: exerciseModel.Exercise) => {
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
      size="large"
      placeholder="Упражнение"
      optionFilterProp="label"
      options={options}
      style={{ height: 'max-content' }}
      labelRender={({ label, value }) => (
        <Flex vertical={false} gap={8} align="center" py={4}>
          <ExerciseAvatar
            exercise={exerciseMap.get(value)}
            onClick={goToExercise}
          />
          <Typography.Text style={{ whiteSpace: 'normal' }}>
            {label}
          </Typography.Text>
        </Flex>
      )}
      optionRender={({ label, value }) => (
        <Flex vertical={false} gap={8} align="center">
          <ExerciseAvatar exercise={exerciseMap.get(value)} />
          <Typography.Text>{label}</Typography.Text>
        </Flex>
      )}
      popupRender={(menu) => (
        <Flex>
          <Flex flex={1} style={{ overflowY: 'auto' }}>
            {menu}
          </Flex>

          <Divider style={{ margin: '8px 0' }} />
          <Button
            block
            type="primary"
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
