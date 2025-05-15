import { Api } from '@/shared/api';
import { Flex } from 'antd';
import { Route } from './+types/coach';

export const clientLoader = async (props: Route.ClientLoaderArgs) => {
  return await Api.user.getListOfMastersGymer(Number(props.params.id));
};

const Page = ({ loaderData }: Route.ComponentProps) => {
  return <Flex vertical>Gymmers count: {loaderData.length}</Flex>;
};

export default Page;
