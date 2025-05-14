import { Api } from '@/shared/api';
import { Flex } from 'antd';
import { Route } from './+types/coach';

export const clientLoader = async (props: Route.ClientLoaderArgs) => {
  // return await Api.gym.getListOfMastersGymer(Number(props.params.id));
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  return <Flex vertical>Coach</Flex>;
};

export default Page;
