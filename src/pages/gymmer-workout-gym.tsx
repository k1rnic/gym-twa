import { Api, UpdateTask } from '@/shared/api-v2';
import { PageDrawer } from '@/shared/ui/page-drawer';
import { useNavigate, useRevalidator } from 'react-router';
import { Route } from './+types/gymmer-workout-gym';

import {
  ExerciseCardBase,
  ExerciseCardList,
  ExerciseMeta,
  ExerciseMetaDivider,
  RestInfo,
  WeightInfo,
} from '@/entities/exercise';
import { Flex } from '@/shared/ui/flex';
import { Typography } from 'antd';
import { useState } from 'react';

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  return await Api.taskGroup
    .listTaskGroup({ gymer_id: +params.gId })
    .then((data) => data.find((group) => group.task_group_id === +params.wId));
};

const Page = ({ params, loaderData }: Route.ComponentProps) => {
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(loaderData!);

  const goBack = () => navigate('../', { replace: true });

  // FIXME: logic
  // const handleRepsChange = (
  //   reps: number | null,
  //   taskIdx: number,
  //   setIdx: number,
  // ) => {
  //   const cloned = structuredClone(workout);
  //   const task = cloned.tasks?.[taskIdx];

  //   if (task.task_properties?.values?.length !== task.task_properties?.sets) {
  //     task.properties.values = Array.from(
  //       { length: task.properties.sets ?? 0 },
  //       (_, idx) => ({
  //         num_set: idx,
  //         value: null,
  //       }),
  //     );
  //   }

  //   if (task.properties.values?.[setIdx]) {
  //     task.properties.values[setIdx].value = reps;
  //   }

  //   setWorkout(cloned);
  // };

  const submitForm = async () => {
    await Promise.all(
      (workout.tasks ?? []).map((task) =>
        // FIXME: why I need to cast here?
        Api.task.updateTask(task as UpdateTask),
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
        exercises={workout!.tasks ?? []}
        renderItem={(ex, index) => (
          <ExerciseCardBase
            ex={ex}
            description={
              <Flex gap={8}>
                {/* {ex.exercise_desc.description} */}
                {ex.task_properties?.sets ? (
                  <Typography>Подходы</Typography>
                ) : null}

                {/* FIXME: fix dependencies */}
                {/* <SetRepListField
                  exercise={ex}
                  onChange={(value, setIdx) =>
                    handleRepsChange(value, index, setIdx)
                  }
                /> */}

                <ExerciseMeta>
                  <WeightInfo
                    min_weight={ex.task_properties?.min_weight}
                    max_weight={ex.task_properties?.max_weight}
                  />
                  <ExerciseMetaDivider />
                  {/* FIXME: fix dependencies */}
                  {/* <SetsXRepsInfo
                  sets={ex.task_properties?.sets}
                  repeats={ex.task_properties?.repeats}
                /> */}
                  <ExerciseMetaDivider />
                  <RestInfo rest={ex.task_properties?.rest} />
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
