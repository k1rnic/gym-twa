import { exerciseModel } from '@/entities/exercise';
import { TaskGroupStatus } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Space } from 'antd';
import { useMemo } from 'react';
import { ExerciseSelector } from './selector';

type FormData = exerciseModel.ExerciseInstance;

export type ExerciseFormProps = {
  masterId: number;
  values: Partial<FormData>;
  status?: TaskGroupStatus | null;
  onSubmit: (values: FormData) => void;
};

export const ExerciseForm = (props: ExerciseFormProps) => {
  const [form] = Form.useForm<FormData>();

  const readonly = props.status
    ? props.status !== TaskGroupStatus.Planned
    : false;

  const initialData = useMemo<DeepPartial<FormData>>(
    () => ({
      task_properties: {
        rest: 0,
        sets: [],
        ...props.values?.task_properties,
      },
      ...props.values,
    }),
    [props.values],
  );

  const handleSubmit = (formData: FormData) => {
    props.onSubmit(formData);
  };

  return (
    <Form<FormData>
      form={form}
      disabled={readonly}
      initialValues={initialData}
      requiredMark={false}
      size="middle"
      onFinish={handleSubmit}
      onFinishFailed={(props) => {
        console.log('onFinishFailed', props);
      }}
    >
      <Flex flex={1}>
        <Form.Item<FormData>
          name="exercise_id"
          rules={[{ required: true, message: 'Необходимо выбрать упражнение' }]}
        >
          <ExerciseSelector masterId={props.masterId} />
        </Form.Item>

        <Form.Item<FormData> name={['task_properties', 'rest']}>
          <InputNumber
            controls={false}
            placeholder="Отдых"
            suffix="сек"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.List name={['task_properties', 'sets']}>
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field, index) => (
                <Space
                  key={field.key}
                  align="center"
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'plan_value']}
                    label={`Вес`}
                    style={{ flex: 1 }}
                    rules={[{ required: true, message: 'Введите вес' }]}
                  >
                    <InputNumber
                      suffix="кг"
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'plan_rep']}
                    label={`Повторы`}
                    style={{ flex: 1 }}
                    rules={[
                      {
                        required: true,
                        message: 'Введите количество повторений',
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Количество"
                      min={1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  {!readonly && (
                    <Button
                      danger
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Space>
              ))}

              {!readonly && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ plan_value: null, plan_rep: null })}
                    icon={<PlusOutlined />}
                    block
                  >
                    Добавить подход
                  </Button>
                </Form.Item>
              )}
            </div>
          )}
        </Form.List>

        {!readonly && (
          <Button block type="primary" htmlType="submit">
            Сохранить
          </Button>
        )}
      </Flex>
    </Form>
  );
};
