import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Divider,
  Form,
  FormListFieldData,
  Input,
  Typography,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';

type Props = {
  field: Omit<FormListFieldData, 'key'>;
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
  index,
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
}: Props) => {
  const { token } = useTheme();

  return (
    <Flex
      height={50}
      vertical={false}
      align="center"
      style={{ backgroundColor: token.colorBgLayout }}
    >
      <Typography style={{ margin: `0 ${token.paddingXS}px` }}>
        {index + 1}
      </Typography>

      <Divider type="vertical" style={{ height: '60%' }} />

      <Form.Item
        {...field}
        name={[field.name, `${valueType}_value`]}
        style={{ margin: 0, flex: 1 }}
      >
        <AutoComplete
          disabled={!canEdit}
          options={valueOptions}
          placeholder={valuePlaceholder}
        >
          <Input
            suffix="кг"
            inputMode="decimal"
            style={{ borderRadius: 0, backgroundColor: 'transparent' }}
          />
        </AutoComplete>
      </Form.Item>

      <Divider type="vertical" style={{ height: '60%' }} />

      <Form.Item
        {...field}
        name={[field.name, `${valueType}_rep`]}
        style={{ margin: 0, flex: 1 }}
      >
        <AutoComplete
          disabled={!canEdit}
          options={repOptions}
          placeholder={repPlaceholder}
        >
          <Input
            suffix="раз"
            inputMode="decimal"
            style={{ borderRadius: 0, backgroundColor: 'transparent' }}
          />
        </AutoComplete>
      </Form.Item>

      <Divider type="vertical" style={{ height: '60%' }} />

      <Flex vertical={false} gap={token.paddingSM}>
        <Button
          hidden={!showFillButton}
          icon={<FormOutlined />}
          type="text"
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
};
