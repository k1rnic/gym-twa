import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { CheckSquareOffsetIcon, XIcon } from '@phosphor-icons/react';
import {
  AutoComplete,
  Divider,
  Form,
  FormListFieldData,
  Input,
  Typography,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Flex
      height={50}
      vertical={false}
      align="center"
      style={{ backgroundColor: token.colorBgLayout, flexShrink: 0 }}
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
            suffix={t('exercise.units.kg')}
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
            suffix={t('exercise.units.reps')}
            inputMode="decimal"
            style={{ borderRadius: 0, backgroundColor: 'transparent' }}
          />
        </AutoComplete>
      </Form.Item>

      <Divider type="vertical" style={{ height: '60%' }} />

      <Flex vertical={false} gap={token.paddingSM} align="center">
        {showFillButton && (
          <CheckSquareOffsetIcon size={20} onClick={onFillFromPlan} />
        )}

        {canRemove && <XIcon size={20} onClick={onRemove} />}
      </Flex>
    </Flex>
  );
};
