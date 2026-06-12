// import {
//   ExerciseInstanceForm,
//   exerciseModel,
//   normalizeSetValues,
// } from '@/entities/exercise';
// import { viewerModel } from '@/entities/viewer';
// import { Api } from '@/shared/api';
// import { useNavigateBack } from '@/shared/lib/router';
// import { PageLayout } from '@/shared/ui/page-layout';
// import { useState } from 'react';
// import { Route } from './+types/exercise-instance-gym';

// export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
//   return await Api.task.getTaskByTaskId(+params.exId);
// };

// const Page = ({ loaderData: initialValues }: Route.ComponentProps) => {
//   const viewer = viewerModel.useViewer();

//   const goBack = useNavigateBack();

//   const [formValues, setFormValues] = useState<exerciseModel.ExerciseInstance>(
//     initialValues!,
//   );

//   const saveChanges = async () => {
//     await Api.task.updateTask(normalizeSetValues(formValues));
//     goBack();
//   };

//   return (
//     <PageLayout title="Выполнение упражнения" onBackClick={saveChanges}>
//       <ExerciseInstanceForm
//         type="fact"
//         masterId={viewer.master!.master_id!}
//         values={initialValues!}
//         onChange={setFormValues}
//       />
//     </PageLayout>
//   );
// };

// export default Page;
