import { Typography } from 'antd';
import { PropsWithChildren } from 'react';

export const SectionTitle = (props: PropsWithChildren) => (
  <Typography.Title level={5} {...props} />
);
