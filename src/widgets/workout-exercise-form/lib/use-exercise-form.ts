import { Form } from 'antd';
import { useMemo } from 'react';

import { workoutModel } from '@/entities/workout';
import { TaskPropertiesAggregate } from '@/shared/api';

export const useExerciseForm = (exercise: workoutModel.WorkoutExercise) => {
  const [form] = Form.useForm<workoutModel.WorkoutExercise>();

  const formValues = Form.useWatch([], form);

  const initialValues = useMemo(() => {
    const taskProperties = exercise.task_properties;

    return {
      ...exercise,
      task_properties: {
        ...taskProperties,
        rest: taskProperties?.rest ?? 120,
      },
    };
  }, [exercise]);

  const mergeValues = () => ({
    ...initialValues,
    ...formValues,
    task_properties: {
      ...initialValues.task_properties,
      ...(formValues?.task_properties as TaskPropertiesAggregate),
    },
  });

  return {
    form,
    formValues,
    initialValues,
    mergeValues,
  };
};
