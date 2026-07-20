import { Spin, SpinProps } from 'antd';

export type PageSpinnerProps = Pick<
  SpinProps,
  'spinning' | 'delay' | 'className'
>;

export const PageSpinner = ({
  spinning,
  delay = 250,
  className = 'page-spinner',
}: PageSpinnerProps) => (
  <Spin fullscreen spinning={spinning} className={className} delay={delay} />
);
