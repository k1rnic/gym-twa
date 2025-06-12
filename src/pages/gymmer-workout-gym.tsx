import { Api } from '@/shared/api';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useNavigate, useRevalidator } from 'react-router';
import { Route } from './+types/gymmer-workout-gym';

import {
  ExerciseCardBase,
  ExerciseCardList,
  ExerciseMeta,
  ExerciseMetaDivider,
  RestInfo,
  SetRepListField,
  SetsXRepsInfo,
  WeightInfo,
} from '@/entities/exercise';
import { Flex } from '@/shared/ui/flex';
import { Typography } from 'antd';
import { useState } from 'react';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.task
    .getMasterTaskGroupsWithTasks(+params.gId)
    .then((data) => data.find((group) => group.task_group_id === +params.wId));
};

const Page = ({ params, loaderData }: Route.ComponentProps) => {
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(loaderData!);

  const goBack = () => navigate('../', { replace: true });

  const handleRepsChange = (
    reps: number | null,
    taskIdx: number,
    setIdx: number,
  ) => {
    const cloned = structuredClone(workout);
    const task = cloned.task[taskIdx];

    if (task.properties.values?.length !== task.properties.sets) {
      task.properties.values = Array.from(
        { length: task.properties.sets ?? 0 },
        (_, idx) => ({
          num_set: idx,
          value: null,
        }),
      );
    }

    if (task.properties.values?.[setIdx]) {
      task.properties.values[setIdx].value = reps;
    }

    setWorkout(cloned);
  };

  const submitForm = async () => {
    await Promise.all(
      workout.task.map((task) =>
        Api.task.gymerUpdateTask(task.task_id, { gymer_id: +params.gId }, task),
      ),
    );

    // FIXME: find the problem why I should call revalidate() here
    revalidate();

    goBack();
  };

  return (
    <PageDrawer
      open
      title="Тренировка"
      placement="bottom"
      height="100%"
      onClose={submitForm}
      styles={{ body: { padding: 8 } }}
    >
      <ExerciseCardList
        exercises={workout!.task}
        renderItem={(ex, index) => (
          <ExerciseCardBase
            ex={ex}
            description={
              <Flex gap={8}>
                {ex.exercise_desc.description}
                {ex.properties.sets ? <Typography>Подходы</Typography> : null}

                <SetRepListField
                  exercise={ex}
                  onChange={(value, setIdx) =>
                    handleRepsChange(value, index, setIdx)
                  }
                />

                <ExerciseMeta>
                  <WeightInfo
                    min_weight={ex.properties.min_weight}
                    max_weight={ex.properties.max_weight}
                  />
                  <ExerciseMetaDivider />
                  <SetsXRepsInfo
                    sets={ex.properties.sets}
                    repeats={ex.properties.repeats}
                  />
                  <ExerciseMetaDivider />
                  <RestInfo rest={ex.properties.rest} />
                </ExerciseMeta>
              </Flex>
            }
          />
        )}
      />
    </PageDrawer>
  );
};

export default Page;
