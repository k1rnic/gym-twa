import { exerciseModel } from '@/entities/exercise';
import { workoutModel } from '@/entities/workout';
import { Flex } from '@/shared/ui/flex';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { FocusEvent, useEffect, useState } from 'react';
import { useExerciseForm } from '../lib/use-exercise-form';
import { useExercisePermissions } from '../lib/use-exercise-permissions';
import { ExerciseSelector } from './exercise-selector';
import { ExerciseSetList } from './exercise-set-list';
import { ExerciseToolbar } from './exercise-toolbar';

type FormValues = exerciseModel.ExerciseInstance;

export type WorkoutExerciseFormProps = {
  exercise: FormValues;
  workout: workoutModel.Workout;
  onSubmit?: (values: FormValues) => void;
  onChange?: (values: FormValues) => void;
};

export const WorkoutExerciseForm = (props: WorkoutExerciseFormProps) => {
  const { workout, exercise } = props;

  const { form, formValues, initialValues, mergeValues } =
    useExerciseForm(exercise);

  const { permissions, workoutStatus } = useExercisePermissions(
    workout,
    exercise,
  );

  const [countDownVisible, setCountDownVisible] = useState(true);
  const [keyboardToolbarVisible, setKeyboardToolbarVisible] = useState(false);

  const handleInputFocusChange = (e: FocusEvent<HTMLFormElement, Element>) => {
    const id = e.target.id;
    const keyboardVisible = id === 'exercise_id' || /_(rep|value)$/.test(id);

    setCountDownVisible(!keyboardVisible);
    setKeyboardToolbarVisible(keyboardVisible);
  };

  useEffect(() => {
    props.onChange?.(mergeValues());
  }, [formValues]);

  return (
    <Form
      form={form}
      initialValues={initialValues}
      disabled={workoutStatus.isFinished}
      onFocus={handleInputFocusChange}
      onBlur={handleInputFocusChange}
    >
      <Flex height="100%">
        <Form.Item name="exercise_id" style={{ margin: 0 }}>
          <ExerciseSelector />
        </Form.Item>

        <ExerciseSetList
          formValues={formValues}
          workoutStatus={workoutStatus}
          permissions={permissions}
        />

        <ExerciseToolbar
          visible={countDownVisible}
          runEnabled={workoutStatus.isActive && permissions.isGymmer}
        />

        <Button
          hidden={!keyboardToolbarVisible}
          icon={<CheckOutlined />}
          shape="round"
          type="primary"
        />
      </Flex>
    </Form>
  );
};
