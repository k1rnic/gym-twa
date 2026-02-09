import { Set, TaskGroupStatus, TaskPropertiesAggregate } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import {
  CloseOutlined,
  FieldTimeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { AutoComplete, Button, Form, InputNumber } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { useEffect, useMemo } from 'react';
import { getFieldSuggestions, SuggestionField } from '../lib/suggestions';
import { ExerciseInstance } from '../model';
import { ExerciseSelector } from './exercise-selector';

type FormValues = ExerciseInstance;
type ExerciseValuesType = 'fact' | 'plan';

export type ExerciseInstanceFormProps<T extends ExerciseValuesType> = {
  masterId: number;
  values: FormValues;
  status?: TaskGroupStatus | null;
  type: T;
  onSubmit?: (values: FormValues) => void;
  onChange?: (values: FormValues) => void;
  readonly?: boolean;
};

export const ExerciseInstanceForm = <T extends ExerciseValuesType>(
  props: ExerciseInstanceFormProps<T>,
) => {
  const [form] = Form.useForm<FormValues>();
  const formValues = Form.useWatch([], form) as FormValues | undefined;

  const { values } = props;
  const initialValues = useMemo<FormValues>(
    () => ({
      ...values,
      task_properties: {
        ...values.task_properties!,
        rest: values.task_properties?.rest ?? 120,
      },
    }),
    [values],
  );

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
    if (props.type === 'fact') {
      return getFieldValue('plan', fieldType, index);
    }
    return fieldType === 'value' ? 'Вес' : 'Количество';
  };

  const getLastSetPlan = (): Pick<Set, `${T}_value` | `${T}_rep`> => {
    const last = (
      (form.getFieldValue(['task_properties', 'sets']) ?? []) as Set[]
    ).at(-1);
    return {
      [`${props.type}_rep`]: last?.[`${props.type}_rep`] ?? null,
      [`${props.type}_value`]: last?.[`${props.type}_value`] ?? null,
    } as Pick<Set, `${T}_value` | `${T}_rep`>;
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
  }, [formValues, initialValues, formValues]);

  const getAutoCompleteOptions = (field: SuggestionField, index: number) => {
    return getFieldSuggestions({
      mode: props.type,
      field,
      index,
      sets: formValues?.task_properties?.sets ?? [],
    }).map((value) => ({ value }));
  };

  return (
    <Form<FormValues>
      form={form}
      initialValues={initialValues}
      size="middle"
      disabled={props.readonly}
      style={{ overflow: 'hidden', height: '100%' }}
    >
      <Flex height="100%">
        <Form.Item<FormValues> name="exercise_id">
          <ExerciseSelector
            disabled={props.type === 'fact'}
            masterId={props.masterId}
          />
        </Form.Item>

        <Form.Item<FormValues> name={['task_properties', 'rest']}>
          <InputNumber
            controls={false}
            placeholder="Отдых"
            suffix="сек"
            prefix={<FieldTimeOutlined />}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.List name={['task_properties', 'sets']}>
          {(fields, { add, remove }) => (
            <Flex height="100%" style={{ overflow: 'hidden' }}>
              <Form.Item hidden={props.readonly}>
                <Button
                  block
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => add(getLastSetPlan())}
                >
                  Добавить подход
                </Button>
              </Form.Item>

              <Flex style={{ overflow: 'auto' }}>
                {fields.map(({ key, ...field }) => (
                  <Flex key={key} vertical={false} align="start">
                    <Flex vertical={false} gap={8} flex={1}>
                      <Form.Item
                        {...field}
                        name={[field.name, `${props.type}_value`]}
                        style={{ flex: 1 }}
                      >
                        <AutoComplete
                          options={getAutoCompleteOptions('value', key)}
                          placeholder={getFieldPlaceholder('value', key)}
                        />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, `${props.type}_rep`]}
                        style={{ flex: 1 }}
                      >
                        <AutoComplete
                          options={getAutoCompleteOptions('rep', key)}
                          placeholder={getFieldPlaceholder('rep', key)}
                        />
                      </Form.Item>
                    </Flex>

                    <Button
                      type="text"
                      hidden={props.readonly}
                      icon={<CloseOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  </Flex>
                ))}
              </Flex>
            </Flex>
          )}
        </Form.List>
      </Flex>
    </Form>
  );
};
