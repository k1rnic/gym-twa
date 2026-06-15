import { Flex } from '@/shared/ui/flex';
import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Form, FormListFieldData, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

type Props = {
  field: FormListFieldData;
  index: number;
  valueType: 'fact' | 'plan';
  canEdit: boolean;
  canRemove: boolean;
  onFillFromPlan(): void;
  onRemove(): void;
  valueOptions: DefaultOptionType[];
  repOptions: DefaultOptionType[];
  valuePlaceholder?: string | number;
  repPlaceholder?: string | number;
  showFillButton: boolean;
};

export const ExerciseSet = ({
  field,
  valueType,
  canEdit,
  canRemove,
  valueOptions,
  repOptions,
  valuePlaceholder,
  repPlaceholder,
  showFillButton,
  onFillFromPlan,
  onRemove,
}: Props) => (
  <Flex vertical={false} align="start" gap={8}>
    <Flex vertical={false} gap={8} flex={1}>
      <Form.Item
        {...field}
        name={[field.name, `${valueType}_value`]}
        style={{ flex: 1 }}
      >
        <AutoComplete
          disabled={!canEdit}
          options={valueOptions}
          placeholder={valuePlaceholder}
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
          disabled={!canEdit}
          options={repOptions}
          placeholder={repPlaceholder}
        >
          <Input suffix="раз" inputMode="decimal" />
        </AutoComplete>
      </Form.Item>
    </Flex>

    <Flex vertical={false}>
      <Button
        hidden={!showFillButton}
        icon={<FormOutlined />}
        type="primary"
        variant="filled"
        onClick={onFillFromPlan}
      />

      <Button
        hidden={!canRemove}
        icon={<CloseOutlined />}
        type="text"
        onClick={onRemove}
      />
    </Flex>
  </Flex>
);
