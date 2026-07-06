import { Set } from '@/shared/api';
import { Button, Divider, FormListOperation } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import { viewerModel } from '@/entities/viewer';
import { workoutModel } from '@/entities/workout';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { CaretDownIcon, PlusIcon } from '@phosphor-icons/react';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { NamePath } from 'antd/es/form/interface';
import { FormListFieldData } from 'antd/lib';
import { getFieldSuggestions, SuggestionField } from '../lib/suggestions';
import { useExercisePermissions } from '../lib/use-exercise-permissions';
import ExerciseKeyboardToolbarItem from './exercise-keyboard-toolbar-item';
import { ExerciseSet } from './exercise-set';

type ValueType = 'fact' | 'plan';
type FieldType = 'value' | 'rep';

const FIELD_PLACEHOLDERS = {
  rep: 'Количество',
  value: 'Вес',
};

type Props = {
  compact?: boolean;
  formValues?: workoutModel.WorkoutExercise;
  fields: FormListFieldData[];
  operations: FormListOperation;
} & ReturnType<typeof useExercisePermissions>;

export const ExerciseSetList = ({
  compact = false,
  formValues,
  workoutStatus,
  permissions,
  operations,
  fields,
}: Props) => {
  const { user_id: viewerId } = viewerModel.useViewer();

  const valueType: ValueType = workoutStatus.isPlanned ? 'plan' : 'fact';
  const repField = `${valueType}_rep` as const;
  const weightField = `${valueType}_value` as const;

  const { token } = useTheme();
  const form = useFormInstance<workoutModel.WorkoutExercise>();

  const getSetOwner = (index: number) => {
    return formValues?.task_properties?.sets?.[index]?.owner_id ?? null;
  };

  const getFieldPath = (
    type: ValueType,
    fieldType: FieldType,
    index: number,
  ): NamePath<workoutModel.WorkoutExercise> => {
    return ['task_properties', 'sets', index, `${type}_${fieldType}`];
  };

  const getFieldValue = (
    type: ValueType,
    fieldType: FieldType,
    index: number,
  ) => form.getFieldValue(getFieldPath(type, fieldType, index)) ?? 0;

  const getFieldPlaceholder = (
    fieldType: FieldType,
    index: number,
  ): string | number =>
    valueType === 'fact'
      ? getFieldValue('plan', fieldType, index)
      : FIELD_PLACEHOLDERS[fieldType];

  const getOptions = (
    field: SuggestionField,
    index: number,
  ): DefaultOptionType[] =>
    getFieldSuggestions({
      index,
      field,
      mode: valueType,
      sets: formValues?.task_properties?.sets ?? [],
    })
      .map((value) => ({ value: `${value}`, label: value }))
      .concat({ value: 'max', label: 'max' });

  const getLastSetValues = () => {
    const sets =
      (form.getFieldValue(['task_properties', 'sets']) as Set[]) ?? [];

    const last = sets.at(-1);

    return {
      owner_id: viewerId,
      [repField]: last?.[repField] ?? null,
      [weightField]: last?.[weightField] ?? null,
    };
  };

  const fillFromPlan = (index: number) => {
    const set = form.getFieldValue(['task_properties', 'sets', index]);

    form.setFieldValue(['task_properties', 'sets', index], {
      ...set,
      fact_rep: set?.plan_rep ?? 0,
      fact_value: set?.plan_value ?? 0,
    });
  };

  const focusNextSet = (index: number) => {
    setTimeout(() => {
      form.focusField(['task_properties', 'sets', index, weightField]);
    }, 0);
  };

  const addNewSet = () => {
    operations.add(getLastSetValues());
    focusNextSet(fields.length);
  };

  return (
    <>
      <Flex
        hidden={!fields.length}
        p={token.paddingSM}
        style={{
          overflowY: 'auto',
          borderRadius: token.borderRadius,
          backgroundColor: token.colorBgLayout,
          marginBottom: token.paddingContentVerticalLG,
        }}
      >
        {fields.map(({ key, ...field }, index) => (
          <>
            <ExerciseSet
              key={key}
              index={index}
              field={field}
              valueType={valueType}
              canEdit={permissions.editSetValues!}
              canRemove={getSetOwner(index) === viewerId}
              showFillButton={workoutStatus.isActive && permissions.isGymmer}
              valueOptions={getOptions('value', field.name)}
              repOptions={getOptions('rep', field.name)}
              valuePlaceholder={getFieldPlaceholder('value', field.name)}
              repPlaceholder={getFieldPlaceholder('rep', field.name)}
              onFillFromPlan={() => fillFromPlan(field.name)}
              onRemove={() => operations.remove(field.name)}
            />
            {index !== fields.length - 1 && <Divider />}
          </>
        ))}
      </Flex>

      <Button
        hidden={!permissions.addTaskSet || compact}
        type="dashed"
        size="large"
        icon={<PlusIcon />}
        onClick={addNewSet}
        style={{ flexShrink: 0 }}
      >
        Добавить подход
      </Button>

      <ExerciseKeyboardToolbarItem hidden={!compact} left={token.padding}>
        <Button size="small" icon={<CaretDownIcon />} type="text" />
      </ExerciseKeyboardToolbarItem>

      <ExerciseKeyboardToolbarItem hidden={!compact} right={token.padding}>
        <Button
          size="small"
          icon={<PlusIcon />}
          type="primary"
          onPointerDown={addNewSet}
        >
          Добавить подход
        </Button>
      </ExerciseKeyboardToolbarItem>
    </>
  );
};
