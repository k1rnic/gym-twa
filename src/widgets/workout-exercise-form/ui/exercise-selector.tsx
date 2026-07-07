import { ExerciseAvatar, exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { CaretDownIcon, PlusIcon } from '@phosphor-icons/react';
import {
  Button,
  Divider,
  RefSelectProps,
  Select,
  SelectProps,
  Typography,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Api } from '@/shared/api';
import classes from './exercise-selector-styles.module.css';

type Props = {
  onCreated?: (ex: exerciseModel.Exercise) => void;
} & Pick<
  SelectProps<number>,
  'value' | 'onChange' | 'style' | 'styles' | 'disabled'
>;

export const ExerciseSelector = ({ onCreated, ...selectProps }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const selectRef = useRef<RefSelectProps>(null);

  const { token } = useTheme();
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
    setOpen(false);

    const ex = await Api.exercise.createExercise({
      master_id: masterId,
      exercise_name: '',
      description: '',
      link_ids: [],
    });

    onCreated?.(ex);
  };

  useEffect(() => {
    if (!open) setTimeout(() => selectRef.current?.blur(), 0);
  }, [open]);

  return (
    <Select
      showSearch
      ref={selectRef}
      open={open}
      virtual={false}
      onOpenChange={setOpen}
      size="large"
      placeholder="Упражнение"
      optionFilterProp="label"
      options={options}
      style={{ height: 'max-content' }}
      className={classes.root}
      suffixIcon={<CaretDownIcon size={14} />}
      labelRender={({ label, value }) => (
        <Flex
          vertical={false}
          gap={token.paddingSM}
          align="center"
          py={token.paddingSM}
        >
          <Flex
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ExerciseAvatar
              exercise={exerciseMap.get(value)}
              onClick={goToExercise}
            />
          </Flex>

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
            icon={<PlusIcon />}
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
