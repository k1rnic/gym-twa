import { viewerModel } from '@/entities/viewer';
import { Api, TaskGroupStatus } from '@/shared/api';
import { sortByCreated } from '@/shared/lib/date';
import { Flex } from '@/shared/ui/flex';
import { FloatButton } from '@/shared/ui/float-button';
import { WorkoutList } from '@/widgets/workout-list';
import { PlusIcon } from '@phosphor-icons/react';
import { Segmented } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import { RouteHandle, useNavigate } from 'react-router';
import { Route } from './+types/workouts';

export const handle: RouteHandle = { root: true };

const FILTERS: SegmentedOptions<TaskGroupStatus> = [
  { label: 'новые', value: TaskGroupStatus.Planned },
  { label: 'текущие', value: TaskGroupStatus.Running },
  { label: 'архив', value: TaskGroupStatus.Finished },
];

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const viewer = viewerModel.getViewerState()!;

  return await Api.taskGroup
    .listTaskGroup({
      gymer_id: +params.gId,
      master_id: viewer.master?.master_id,
      status: params.status as TaskGroupStatus,
    })
    .then((data) => data.sort(sortByCreated()))
    .catch(() => []);
};

const Page = ({ loaderData: workouts, params }: Route.ComponentProps) => {
  const navigate = useNavigate();

  const viewer = viewerModel.useViewer();
  const status = params.status as TaskGroupStatus;

  const createWorkout = async () => {
    const data = await Api.taskGroup.createTaskGroup({
      master_id: viewer.master!.master_id!,
      gymer_id: +params.gId,
      title: '',
    });

    navigate(`../${TaskGroupStatus.Planned}/${data.task_group_id}`, {
      relative: 'path',
    });
  };

  const filterWorkouts = (status: TaskGroupStatus) => {
    navigate(`../${status}`, { relative: 'path' });
  };

  return (
    <Flex
      height="100%"
      gap={8}
      style={{ overflowY: 'auto', position: 'relative' }}
    >
      <Segmented
        block
        options={FILTERS}
        value={status}
        onChange={filterWorkouts}
      />

      <WorkoutList reorderEnabled data={workouts} />

      <FloatButton icon={<PlusIcon />} onClick={createWorkout} />
    </Flex>
  );
};

export default Page;
