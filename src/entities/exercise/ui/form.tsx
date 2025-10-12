import { exerciseModel } from '@/entities/exercise';
import { TaskGroupStatus } from '@/shared/api';
import { Flex } from '@/shared/ui/flex';
import { CloseOutlined } from '@ant-design/icons';
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

  const initialData = useMemo<Partial<FormData>>(
    () => ({ properties: {}, ...props.values }),
    [props.values],
  );

  const updateWeights = () => {
    const minWeight =
      form.getFieldValue(['task_properties', 'min_weight']) || 0;
    const maxWeight =
      form.getFieldValue(['task_properties', 'max_weight']) || 0;
    if (minWeight > maxWeight) {
      form.setFieldValue(['task_properties', 'max_weight'], minWeight);
    } else if (maxWeight < minWeight) {
      form.setFieldValue(['task_properties', 'min_weight'], maxWeight);
    }
  };

  const handleSubmit = (formData: FormData) => {
    props.onSubmit(formData);
  };

  return (
    <Form<FormData>
      form={form}
      disabled={readonly}
      initialValues={initialData}
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

        <Space align="baseline">
          <Form.Item<FormData> name={['task_properties', 'min_weight']}>
            <InputNumber
              controls={false}
              placeholder="Вес"
              suffix="кг"
              style={{ width: '100%' }}
              onBlur={updateWeights}
            />
          </Form.Item>
          -
          <Form.Item<FormData> name={['task_properties', 'max_weight']}>
            <InputNumber
              controls={false}
              placeholder="Вес"
              suffix="кг"
              style={{ width: '100%' }}
              onBlur={updateWeights}
            />
          </Form.Item>
        </Space>

        <Form.Item<FormData> name={['task_properties', 'rest']}>
          <InputNumber
            controls={false}
            placeholder="Отдых"
            suffix="сек"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Space align="baseline">
          <Form.Item<FormData> name={['task_properties', 'sets']}>
            <InputNumber
              controls={false}
              placeholder="Подходы"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <CloseOutlined />

          {/* <Form.Item<FormData> name={['task_properties', 'repeats']}>
            <InputNumber
              controls={false}
              placeholder="Повторения"
              style={{ width: '100%' }}
            />
          </Form.Item> */}
        </Space>

        {!readonly && (
          <Button block type="primary" htmlType="submit">
            Сохранить
          </Button>
        )}
      </Flex>
    </Form>
  );
};
