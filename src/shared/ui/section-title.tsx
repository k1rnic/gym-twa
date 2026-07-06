import { Typography } from 'antd';
import { TitleProps } from 'antd/es/typography/Title';
import { PropsWithChildren } from 'react';

export const SectionTitle = (props: PropsWithChildren & TitleProps) => (
  <Typography.Title level={5} {...props} />
);
