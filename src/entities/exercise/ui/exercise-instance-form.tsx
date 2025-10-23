import { Set, TaskGroupStatus, TaskPropertiesAggregate } from '@/shared/api';
import { DeleteButton } from '@/shared/ui/delete-button';
import { Flex } from '@/shared/ui/flex';
import {
  CloseOutlined,
  FieldTimeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Form, InputNumber, Tooltip } from 'antd';
import { useEffect } from 'react';
import { ExerciseInstance } from '../model';
import { ExerciseSelector } from './exercise-selector';

type FormValues = ExerciseInstance;

export type ExerciseInstanceFormProps<T extends 'fact' | 'plan'> = {
  masterId: number;
  values: FormValues;
  status?: TaskGroupStatus | null;
  type: T;
  onSubmit?: (values: FormValues) => void;
  onChange?: (values: FormValues) => void;
};

export const ExerciseInstanceForm = <T extends 'fact' | 'plan'>(
  props: ExerciseInstanceFormProps<T>,
) => {
  const [form] = Form.useForm<FormValues>();
  const formValues = Form.useWatch([], form) as FormValues | undefined;

  const { values: initialValues } = props;

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
  }, [formValues]);

  return (
    <Form<FormValues>
      form={form}
      initialValues={initialValues}
      size="middle"
      style={{ overflow: 'hidden', height: '100%' }}
    >
      <Flex height="100%">
        <Form.Item<FormValues> name="exercise_id">
          <ExerciseSelector masterId={props.masterId} />
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
              <Form.Item>
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
                      <Tooltip
                        title={
                          props.type === 'fact'
                            ? `Вес (план): ${
                                form.getFieldValue([
                                  'task_properties',
                                  'sets',
                                  0,
                                  'plan_value',
                                ]) ?? 0
                              } кг`
                            : ''
                        }
                        placement="bottom"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, `${props.type}_value`]}
                          style={{ flex: 1 }}
                        >
                          <InputNumber
                            controls={false}
                            placeholder="Вес"
                            suffix="кг"
                            type="number"
                            min={1}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Tooltip>

                      <Tooltip
                        title={
                          props.type === 'fact'
                            ? `Количество (план): ${
                                form.getFieldValue([
                                  'task_properties',
                                  'sets',
                                  0,
                                  'plan_value',
                                ]) ?? 0
                              }`
                            : ''
                        }
                        placement="bottom"
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, `${props.type}_rep`]}
                          style={{ flex: 1 }}
                        >
                          <InputNumber
                            controls={false}
                            placeholder="Количество"
                            suffix="раз"
                            type="number"
                            min={1}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Tooltip>
                    </Flex>

                    <Button
                      type="text"
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
