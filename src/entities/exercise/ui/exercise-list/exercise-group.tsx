import { List, ListItem } from '@/shared/ui/list';
import { Divider } from 'antd';
import React from 'react';
import { Exercise } from '../../model';
import { ExerciseAvatar } from '../exercise-avatar';

interface ExerciseGroupProps {
  title: string;
  data: Exercise[];
  onSelect: (exercise: Exercise) => void;
  listItemStyle?: (ex: Exercise, idx: number) => React.CSSProperties;
}

export const ExerciseGroup: React.FC<ExerciseGroupProps> = ({
  title,
  data,
  listItemStyle,
  onSelect,
}) => {
  if (!data.length) return null;

  return (
    <>
      <Divider>{title}</Divider>
      <List
        items={data}
        itemKey="exercise_id"
        variant="contained"
        size="small"
        emptyText="Упражнения пока не добавлены"
        renderItem={(task, idx) => (
          <ListItem
            nav
            avatar={<ExerciseAvatar exercise={task} />}
            header={task.exercise_name}
            description={task.description}
            onClick={() => onSelect(task)}
            style={listItemStyle?.(task, idx)}
          />
        )}
      />
    </>
  );
};
