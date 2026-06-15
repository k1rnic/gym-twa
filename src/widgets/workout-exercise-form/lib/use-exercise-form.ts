import { Form } from 'antd';
import { useMemo } from 'react';

import { exerciseModel } from '@/entities/exercise';
import { TaskPropertiesAggregate } from '@/shared/api';

export const useExerciseForm = (exercise: exerciseModel.ExerciseInstance) => {
  const [form] = Form.useForm<exerciseModel.ExerciseInstance>();

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
