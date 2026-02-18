import { Flex } from '@/shared/ui/flex';
import { RightOutlined } from '@ant-design/icons';
import { Divider, List, Typography } from 'antd';
import React from 'react';
import { Exercise } from '../../model';
import { ExerciseAvatar } from '../exercise-avatar';

const { Text, Paragraph } = Typography;

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
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, idx) => (
          <List.Item
            onClick={() => onSelect(item)}
            style={{
              cursor: 'pointer',
              paddingLeft: 0,
              paddingRight: 0,
              ...listItemStyle?.(item, idx),
            }}
          >
            <Flex vertical={false} width="100%">
              <List.Item.Meta
                avatar={<ExerciseAvatar />}
                title={<Text strong>{item.exercise_name}</Text>}
                description={
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 1, tooltip: item.description }}
                    style={{ marginBottom: 0 }}
                  >
                    {item.description}
                  </Paragraph>
                }
              />
              <RightOutlined style={{ marginLeft: 8 }} />
            </Flex>
          </List.Item>
        )}
      />
    </>
  );
};
