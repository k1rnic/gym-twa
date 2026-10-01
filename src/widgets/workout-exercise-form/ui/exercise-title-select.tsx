import { ExerciseAvatar } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { CaretDownIcon } from '@phosphor-icons/react';
import { Select, SelectProps, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { getGroupExercises } from '../lib/get-group-exercises';

type Props = {
  exercise: workoutModel.WorkoutExercise;
  workout: workoutModel.Workout;
} & Pick<SelectProps<number>, 'value' | 'onChange'>;

/**
 * Название упражнения на экране упражнения тренировки.
 *
 * Вне группы селект только для чтения: сменить упражнение у созданного
 * упражнения нельзя, но можно перейти к самому упражнению по аватарке.
 * Внутри группы селект переключает между упражнениями группы.
 */
export const ExerciseTitleSelect = ({
  exercise,
  workout,
  value,
  onChange,
}: Props) => {
  const { t } = useTranslation();
  const { token } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const groupExercises = useMemo(
    () => getGroupExercises(workout, exercise),
    [workout, exercise],
  );
  const inGroup = groupExercises.length > 0;

  const currentExercise = exercise.exercise ?? null;
  const currentName = currentExercise?.exercise_name || t('common.unknownName');

  const groupTasks = useMemo(
    () => new Map(groupExercises.map((task) => [task.task_id, task] as const)),
    [groupExercises],
  );

  const selectedValue = inGroup
    ? exercise.task_id
    : value ?? exercise.exercise_id ?? undefined;

  const options = useMemo(() => {
    if (inGroup) {
      return groupExercises.map((task) => ({
        label: task.exercise?.exercise_name || t('common.unknownName'),
        value: task.task_id,
      }));
    }

    return selectedValue === undefined
      ? []
      : [{ label: currentName, value: selectedValue }];
  }, [inGroup, groupExercises, selectedValue, currentName, t]);

  const goToExercise = () => {
    if (!currentExercise?.exercise_id) return;

    navigate(`/exercises/${currentExercise.exercise_id}`);
  };

  const goToGroupExercise = (taskId: number) => {
    navigate(`../${taskId}`, { relative: 'path', replace: true });
  };

  return (
    <Select
      size="large"
      virtual={false}
      showSearch={false}
      open={inGroup ? open : false}
      onOpenChange={inGroup ? setOpen : undefined}
      onChange={inGroup ? goToGroupExercise : onChange}
      value={selectedValue}
      options={options}
      placeholder={t('exercise.title')}
      style={{ height: 'max-content' }}
      suffixIcon={inGroup ? <CaretDownIcon size={14} /> : null}
      optionRender={({ value: optionValue }) => {
        const task =
          typeof optionValue === 'number'
            ? groupTasks.get(optionValue)
            : undefined;

        return (
          <Flex vertical={false} gap={8} align="center">
            <ExerciseAvatar exercise={task?.exercise ?? undefined} />
            <Typography.Text>
              {task?.exercise?.exercise_name || t('common.unknownName')}
            </Typography.Text>
          </Flex>
        );
      }}
      labelRender={({ label }) => (
        <Flex
          vertical={false}
          gap={token.paddingSM}
          align="center"
          py={token.paddingSM}
        >
          <Flex
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <ExerciseAvatar
              exercise={currentExercise ?? undefined}
              onClick={goToExercise}
            />
          </Flex>

          <Typography.Text style={{ whiteSpace: 'normal' }}>
            {label ?? currentName}
          </Typography.Text>
        </Flex>
      )}
    />
  );
};
