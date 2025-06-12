import { TaskGroupStatus, TaskGroupWithTasks } from '@/shared/api';
import { Segmented } from 'antd';
import { useEffect, useMemo, useState } from 'react';

export type WorkoutsFilterProps = {
  initialStatus?: TaskGroupStatus;
  workouts: TaskGroupWithTasks[];
  onFilter: (workouts: TaskGroupWithTasks[], status: TaskGroupStatus) => void;
};

export const WorkoutFilter = (props: WorkoutsFilterProps) => {
  const [status, setStatus] = useState<TaskGroupStatus>(
    props.initialStatus ?? TaskGroupStatus.Planned,
  );

  const filteredWorkouts = useMemo(
    () => props.workouts.filter((w) => w.status === status),
    [props.workouts, status],
  );

  useEffect(() => {
    props.onFilter(filteredWorkouts, status);
  }, [filteredWorkouts, status]);

  return (
    <Segmented
      block
      options={[
        { label: 'новые', value: TaskGroupStatus.Planned },
        { label: 'текущие', value: TaskGroupStatus.Running },
        { label: 'завершенные', value: TaskGroupStatus.Finished },
      ]}
      value={status}
      onChange={setStatus}
      style={{ marginBottom: 8 }}
    />
  );
};
