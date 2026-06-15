import { Set } from '@/shared/api';
import { Button, Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import { exerciseModel } from '@/entities/exercise';
import { viewerModel } from '@/entities/viewer';
import { useExercisePermissions } from '@/widgets/workout-exercise-form/lib/use-exercise-permissions';
import { PlusOutlined } from '@ant-design/icons';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { NamePath } from 'antd/es/form/interface';
import { getFieldSuggestions, SuggestionField } from '../lib/suggestions';
import { ExerciseSet } from './exercise-set';

type ValueType = 'fact' | 'plan';
type FieldType = 'value' | 'rep';

const FIELD_PLACEHOLDERS = {
  rep: 'Количество',
  value: 'Вес',
};

type Props = {
  formValues?: exerciseModel.ExerciseInstance;
} & ReturnType<typeof useExercisePermissions>;

export const ExerciseSetList = ({
  formValues,
  workoutStatus,
  permissions,
}: Props) => {
  const { user_id: viewerId } = viewerModel.useViewer();

  const valueType: ValueType = workoutStatus.isPlanned ? 'plan' : 'fact';

  const form = useFormInstance<exerciseModel.ExerciseInstance>();

  const getSetOwner = (index: number) =>
    formValues?.task_properties?.sets?.[index]?.owner_id ?? null;

  const getFieldPath = (
    type: ValueType,
    fieldType: FieldType,
    index: number,
  ): NamePath<exerciseModel.ExerciseInstance> => {
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
      [`${valueType}_rep`]: last?.[`${valueType}_rep`] ?? null,
      [`${valueType}_value`]: last?.[`${valueType}_value`] ?? null,
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

  return (
    <Form.List name={['task_properties', 'sets']}>
      {(fields, operations) => (
        <>
          {fields.map((field, index) => (
            <ExerciseSet
              key={field.key}
              index={index}
              field={field}
              valueType={valueType}
              canEdit={permissions.editSetValues}
              canRemove={getSetOwner(index) === viewerId}
              showFillButton={workoutStatus.isActive && permissions.isGymmer}
              valueOptions={getOptions('value', field.name)}
              repOptions={getOptions('rep', field.name)}
              valuePlaceholder={getFieldPlaceholder('value', field.name)}
              repPlaceholder={getFieldPlaceholder('rep', field.name)}
              onFillFromPlan={() => fillFromPlan(field.name)}
              onRemove={() => operations.remove(field.name)}
            />
          ))}

          <Button
            hidden={!permissions.addTaskSet}
            type="dashed"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => operations.add(getLastSetValues())}
          >
            Добавить подход
          </Button>
        </>
      )}
    </Form.List>
  );
};
