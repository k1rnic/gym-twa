import { viewerModel } from '@/entities/viewer';
import {
  getWorkoutStatus,
  useWorkoutAccesses,
  workoutModel,
} from '@/entities/workout';
import { Set, TaskPropertiesAggregate } from '@/shared/api';
import { useToggle } from '@/shared/lib/hooks';
import { CountDown } from '@/shared/ui/countdown';
import { Flex } from '@/shared/ui/flex';
import {
  CheckOutlined,
  CloseOutlined,
  FormOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { AutoComplete, Button, Form, Input } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { DefaultOptionType } from 'antd/es/select';
import { FormListOperation } from 'antd/lib';
import { FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { getFieldSuggestions, SuggestionField } from '../lib/suggestions';
import { ExerciseInstance } from '../model';
import { ExerciseSelector } from './exercise-selector';

type FormValues = ExerciseInstance;
type ExerciseValuesType = 'fact' | 'plan';

export type ExerciseInstanceFormProps<T extends ExerciseValuesType> = {
  exercise: FormValues;
  workout: workoutModel.Workout;
  onSubmit?: (values: FormValues) => void;
  onChange?: (values: FormValues) => void;
};

export const ExerciseInstanceForm = <T extends ExerciseValuesType>(
  props: ExerciseInstanceFormProps<T>,
) => {
  const [form] = Form.useForm<FormValues>();
  const formValues = Form.useWatch([], form) as FormValues | undefined;

  const exerciseListOps = useRef<FormListOperation>();

  const [showToolbar, toggleToolbar] = useToggle(true);

  const { workout, exercise } = props;
  const viewer = viewerModel.useViewer();

  const initialValues = useMemo<FormValues>(
    () => ({
      ...exercise,
      task_properties: {
        ...exercise.task_properties!,
        rest: exercise.task_properties?.rest ?? 120,
      },
    }),
    [exercise],
  );

  const accesses = useWorkoutAccesses(workout, exercise);
  const workoutStatus = useMemo(
    () => getWorkoutStatus(workout.status),
    [workout.status],
  );

  const valueType: ExerciseValuesType = workoutStatus.isPlanned
    ? 'plan'
    : 'fact';

  const getFieldPath = (
    type: ExerciseValuesType,
    fieldType: 'value' | 'rep',
    index: number,
  ) => {
    const name = `${type}_${fieldType}` as const;
    return ['task_properties', 'sets', index, name] as NamePath<FormValues>;
  };

  const getFieldValue = (
    type: ExerciseValuesType,
    fieldType: 'value' | 'rep',
    index: number,
  ) => form.getFieldValue(getFieldPath(type, fieldType, index)) ?? 0;

  const getFieldPlaceholder = (fieldType: 'value' | 'rep', index: number) => {
    if (valueType === 'fact') {
      return getFieldValue('plan', fieldType, index);
    }
    return fieldType === 'value' ? 'Вес' : 'Количество';
  };

  const [inputToolbarFocused, setInputToolbarFocused] = useState(false);

  const handleInputFocusChange = (e: FocusEvent<HTMLFormElement, Element>) => {
    const id = e.target.id;

    if (id.endsWith('_rep') || id.endsWith('_value') || id === 'exercise_id') {
      toggleToolbar();
      setInputToolbarFocused(e.type === 'focus');
    } else {
      setInputToolbarFocused(false);
    }
  };

  useEffect(() => {
    props.onChange?.({
      ...initialValues,
      ...formValues,
      task_properties: {
        ...initialValues.task_properties,
        ...(formValues?.task_properties as TaskPropertiesAggregate),
      },
    });
  }, [formValues, initialValues]);

  const getAutoCompleteOptions = (field: SuggestionField, index: number) => {
    return getFieldSuggestions({
      mode: valueType,
      field,
      index,
      sets: formValues?.task_properties?.sets ?? [],
    })
      .map<DefaultOptionType>((value) => ({ value: `${value}`, label: value }))
      .concat({ value: 'max', label: 'max' });
  };

  const getLastSetValues = (): Pick<Set, `${T}_value` | `${T}_rep`> => {
    const last = (
      (form.getFieldValue(['task_properties', 'sets']) ?? []) as Set[]
    ).at(-1);
    return {
      [`${valueType}_rep`]: last?.[`${valueType}_rep`] ?? null,
      [`${valueType}_value`]: last?.[`${valueType}_value`] ?? null,
      owner_id: viewer.user_id,
    } as Pick<Set, `${T}_value` | `${T}_rep` | 'owner_id'>;
  };

  const fillFromPlan = (index: number) => {
    form.setFieldValue(
      ['task_properties', 'sets', index, 'fact_rep'],
      form.getFieldValue(['task_properties', 'sets', index, 'plan_rep']) ?? 0,
    );
    form.setFieldValue(
      ['task_properties', 'sets', index, 'fact_value'],
      form.getFieldValue(['task_properties', 'sets', index, 'plan_value']) ?? 0,
    );
  };

  return (
    <Form<FormValues>
      form={form}
      disabled={workoutStatus.isFinished}
      initialValues={initialValues}
      size="middle"
      style={{ overflow: 'hidden', height: '100%' }}
      onFocus={handleInputFocusChange}
      onBlur={handleInputFocusChange}
    >
      <Flex height="100%" style={{ position: 'relative' }}>
        <Form.Item<FormValues>
          name="exercise_id"
          style={{ margin: 0, width: '100%' }}
        >
          <ExerciseSelector />
        </Form.Item>

        <Form.List name={['task_properties', 'sets']}>
          {(fields, listActions) => {
            exerciseListOps.current = listActions;

            return (
              <Flex flex={1} style={{ overflow: 'auto' }}>
                {fields.map(({ key, ...field }, idx) => (
                  <Flex key={key} vertical={false} align="start" gap={8}>
                    <Flex vertical={false} gap={8} flex={1}>
                      <Form.Item
                        {...field}
                        name={[field.name, `${valueType}_value`]}
                        style={{ flex: 1 }}
                      >
                        <AutoComplete
                          disabled={
                            !(
                              (accesses.isGymmer && workoutStatus.isActive) ||
                              (accesses.isTaskOwner && workoutStatus.isPlanned)
                            )
                          }
                          options={getAutoCompleteOptions('value', field.name)}
                          placeholder={getFieldPlaceholder('value', field.name)}
                        >
                          <Input suffix="кг" inputMode="decimal" />
                        </AutoComplete>
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, `${valueType}_rep`]}
                        style={{ flex: 1 }}
                      >
                        <AutoComplete
                          disabled={
                            !(
                              (accesses.isGymmer && workoutStatus.isActive) ||
                              (accesses.isTaskOwner && workoutStatus.isPlanned)
                            )
                          }
                          options={getAutoCompleteOptions('rep', field.name)}
                          placeholder={getFieldPlaceholder('rep', field.name)}
                        >
                          <Input suffix="раз" inputMode="decimal" />
                        </AutoComplete>
                      </Form.Item>
                    </Flex>

                    <Flex vertical={false}>
                      <Button
                        variant="filled"
                        type="primary"
                        hidden={!(workoutStatus.isActive && accesses.isGymmer)}
                        icon={<FormOutlined />}
                        onClick={() => fillFromPlan(field.name)}
                      />
                      <Button
                        type="text"
                        hidden={
                          viewer.user_id !==
                          formValues?.task_properties?.sets?.[idx].owner_id
                        }
                        icon={<CloseOutlined />}
                        onClick={() =>
                          exerciseListOps.current!.remove(field.name)
                        }
                      />
                    </Flex>
                  </Flex>
                ))}

                <Button
                  hidden={!accesses.addTaskSet}
                  type="dashed"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    exerciseListOps.current!.add(getLastSetValues())
                  }
                >
                  Добавить подход
                </Button>
              </Flex>
            );
          }}
        </Form.List>

        {showToolbar && (
          <Form.Item<FormValues>
            name={['task_properties', 'rest']}
            style={{ margin: 0, width: '100%' }}
          >
            <CountDown
              runEnabled={workoutStatus.isActive && accesses.isGymmer}
              placeholder="Отдых"
            />
          </Form.Item>
        )}

        <Button
          type="primary"
          hidden={!inputToolbarFocused}
          style={{ position: 'fixed', bottom: 8, zIndex: 9999 }}
          icon={<CheckOutlined />}
          shape="round"
        />
      </Flex>
    </Form>
  );
};
