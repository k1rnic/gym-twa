import { viewerModel } from '@/entities/viewer';
import { Api, TaskGroupStatus } from '@/shared/api';
import { sortByCreated } from '@/shared/lib/date';
import { Flex } from '@/shared/ui/flex';
import { FloatButton } from '@/shared/ui/float-button';
import { WorkoutList } from '@/widgets/workout-list';
import { PlusIcon } from '@phosphor-icons/react';
import { Segmented } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteHandle, useNavigate } from 'react-router';
import { Route } from './+types/workouts';

export const handle: RouteHandle = { root: true };

const FILTERS = [
  { label: 'training.new', value: TaskGroupStatus.Planned },
  { label: 'training.current', value: TaskGroupStatus.Running },
  { label: 'training.archive', value: TaskGroupStatus.Finished },
];

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const gymmerId = +params.gId;
  const viewer = viewerModel.getViewerState()!;
  const isMe = viewer.gymer?.gymer_id === gymmerId;

  return await Api.taskGroup
    .listTaskGroup({
      gymer_id: gymmerId,
      master_id: isMe ? undefined : viewer.master?.master_id,
      status: params.status as TaskGroupStatus,
    })
    .then((data) => data.sort(sortByCreated()))
    .catch(() => []);
};

const Page = ({ loaderData: workouts, params }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const viewer = viewerModel.useViewer();
  const status = params.status as TaskGroupStatus;

  const filtersLocalized = useMemo(
    () =>
      FILTERS.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [t],
  );

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
        options={filtersLocalized}
        value={status}
        onChange={filterWorkouts}
      />

      <WorkoutList reorderEnabled data={workouts} />

      <FloatButton icon={<PlusIcon />} onClick={createWorkout} />
    </Flex>
  );
};

export default Page;
