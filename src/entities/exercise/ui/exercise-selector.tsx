import { Api } from '@/shared/api';
import { useSelectKeyboardDistance, useToggle } from '@/shared/lib/hooks';
import { Flex } from '@/shared/ui/flex';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select, SelectProps, Typography } from 'antd';
import { RefSelectProps } from 'antd/es/select';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Exercise, useExercises } from '../model';
import { ExerciseAvatar } from './exercise-avatar';

type Props = {
  masterId: number;
} & Pick<
  SelectProps<number>,
  'value' | 'onChange' | 'style' | 'styles' | 'disabled'
>;

export const ExerciseSelector = ({ masterId, ...selectProps }: Props) => {
  const exercises = useExercises(masterId);

  const selectRef = useRef<RefSelectProps>(null);
  const distance = useSelectKeyboardDistance(selectRef);

  const [searchFocused, toggleSearch] = useToggle();

  const navigate = useNavigate();

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
      ref={selectRef}
      virtual={false}
      placeholder="Упражнение"
      optionFilterProp="label"
      options={options}
      style={{ height: 'max-content' }}
      onFocus={toggleSearch}
      onBlur={toggleSearch}
      labelRender={({ label, value }) =>
        searchFocused ? (
          label
        ) : (
          <Flex vertical={false} gap={8} align="center" py={4}>
            <ExerciseAvatar exercise={exerciseMap.get(value)} />
            <Typography.Text style={{ whiteSpace: 'normal' }}>
              {label}
            </Typography.Text>
          </Flex>
        )
      }
      optionRender={({ label, value }) => (
        <Flex vertical={false} gap={8} align="center">
          <ExerciseAvatar exercise={exerciseMap.get(value)} />
          <Typography.Text>{label}</Typography.Text>
        </Flex>
      )}
      popupRender={(menu) => (
        <Flex style={{ maxHeight: distance - 16 }}>
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
