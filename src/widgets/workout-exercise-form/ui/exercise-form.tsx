import { workoutModel } from '@/entities/workout';
import { useVirtualKeyboardOpened } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { SectionTitle } from '@/shared/ui/section-title';
import { Form } from 'antd';
import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getNextSupersetTaskId } from '../lib/get-next-superset-task-id';
import { useExerciseForm } from '../lib/use-exercise-form';
import { useExercisePermissions } from '../lib/use-exercise-permissions';
import { ExerciseCountDown } from './exercise-countdown';
import { ExerciseNextButton } from './exercise-next-button';
import { ExerciseSetList } from './exercise-set-list';
import { ExerciseTitleSelect } from './exercise-title-select';

type FormValues = workoutModel.WorkoutExercise;

export type WorkoutExerciseFormProps = {
  exercise: FormValues;
  workout: workoutModel.Workout;
  onSubmit?: (values: FormValues) => void;
};

export const WorkoutExerciseForm = (props: WorkoutExerciseFormProps) => {
  const { t } = useTranslation();
  const { token } = useTheme();
  const { workout, exercise } = props;

  const navigate = useNavigate();

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { form, formValues, initialValues } = useExerciseForm(exercise);

  const { permissions, workoutStatus } = useExercisePermissions(
    workout,
    exercise,
  );

  const virtualKeyboardOpened = useVirtualKeyboardOpened();

  const runEnabled = workoutStatus.isActive && permissions.isGymmer;

  const nextTaskId = getNextSupersetTaskId(workout, exercise);

  const isFormFocused = Boolean(focusedField);

  const isFocusedSetValues = useMemo(
    () => isFormFocused && /_(rep|value)$/.test(focusedField!),
    [isFormFocused, focusedField],
  );

  const isFocusedCountdown = useMemo(
    () => isFormFocused && /_(rest)$/.test(focusedField!),
    [isFormFocused, focusedField],
  );

  const handleInputFocusChange = (e: FocusEvent<HTMLFormElement, Element>) => {
    setFocusedField(e.type === 'focus' ? e.target.id : null);
  };

  const goToNextExercise = () => {
    if (nextTaskId === null) return;

    navigate(`../${nextTaskId}`, { relative: 'path', replace: true });
  };

  useEffect(() => {
    return () => {
      props.onSubmit?.(form.getFieldsValue(true));
    };
  }, []);

  return (
    <Flex height="100%">
      <Form
        form={form}
        style={{ flex: 1, overflow: 'hidden' }}
        initialValues={initialValues}
        disabled={workoutStatus.isFinished || !permissions.modifyWorkout}
        onFocus={handleInputFocusChange}
        onBlur={handleInputFocusChange}
      >
        <Flex height="100%" gap={token.paddingSM}>
          <Form.Item name="exercise_id" style={{ margin: 0 }}>
            <ExerciseTitleSelect exercise={exercise} workout={workout} />
          </Form.Item>

          <Flex
            height="100%"
            flex={1}
            gap={token.paddingSM}
            style={{ overflow: 'hidden' }}
          >
            <Flex
              vertical={false}
              width="100%"
              align="center"
              justify="space-between"
            >
              <SectionTitle>{t('exercise.setsTitle')}</SectionTitle>

              <ExerciseNextButton
                hidden={
                  virtualKeyboardOpened || !runEnabled || nextTaskId === null
                }
                onClick={goToNextExercise}
              />
            </Flex>

            <Form.List name={['task_properties', 'sets']}>
              {(fields, operations) => (
                <ExerciseSetList
                  fields={fields}
                  operations={operations}
                  compact={virtualKeyboardOpened && isFocusedSetValues}
                  formValues={formValues}
                  workoutStatus={workoutStatus}
                  permissions={permissions}
                />
              )}
            </Form.List>
          </Flex>

          <ExerciseCountDown
            hidden={
              (virtualKeyboardOpened && !isFocusedCountdown) ||
              nextTaskId !== null
            }
            runEnabled={runEnabled}
          />
        </Flex>
      </Form>
    </Flex>
  );
};
