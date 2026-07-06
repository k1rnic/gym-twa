import { exerciseModel } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { useVirtualKeyboardOpened } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { SectionTitle } from '@/shared/ui/section-title';
import { Form } from 'antd';
import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useExerciseForm } from '../lib/use-exercise-form';
import { useExercisePermissions } from '../lib/use-exercise-permissions';
import { ExerciseCountDown } from './exercise-countdown';
import { ExerciseSelector } from './exercise-selector';
import { ExerciseSetList } from './exercise-set-list';

type FormValues = workoutModel.WorkoutExercise;

export type WorkoutExerciseFormProps = {
  exercise: FormValues;
  workout: workoutModel.Workout;
  onSubmit?: (values: FormValues) => void;
};

export const WorkoutExerciseForm = (props: WorkoutExerciseFormProps) => {
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

  const isFormFocused = Boolean(focusedField);

  const isFocusedExerciseSelector = useMemo(
    () => isFormFocused && focusedField === 'exercise_id',
    [isFormFocused, focusedField],
  );

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

  const handleExerciseCreated = (ex: exerciseModel.Exercise) => {
    form.setFieldValue('exercise_id', ex.exercise_id);
    requestAnimationFrame(() => {
      navigate(`/exercises/${ex.exercise_id}`);
    });
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
        disabled={workoutStatus.isFinished}
        onFocus={handleInputFocusChange}
        onBlur={handleInputFocusChange}
      >
        <Flex height="100%" gap={token.paddingSM}>
          <Form.Item name="exercise_id" style={{ margin: 0 }}>
            <ExerciseSelector onCreated={handleExerciseCreated} />
          </Form.Item>

          <Flex
            hidden={isFocusedExerciseSelector}
            height="100%"
            flex={1}
            gap={token.paddingSM}
            style={{ overflow: 'hidden' }}
          >
            <SectionTitle>Подходы</SectionTitle>

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
            hidden={virtualKeyboardOpened && !isFocusedCountdown}
            runEnabled={workoutStatus.isActive && permissions.isGymmer}
          />
        </Flex>
      </Form>
    </Flex>
  );
};
