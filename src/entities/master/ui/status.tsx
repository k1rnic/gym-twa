import { GymerMasterStatus } from '@/shared/api';
import { Tag } from 'antd';
import { useMemo } from 'react';
import { masterStatusFormatter } from '../lib';

export type MasterStatusProps = {
  status?: GymerMasterStatus | null;
};

export const MasterStatus = (props: MasterStatusProps) => {
  const { label, color } = useMemo(
    () => masterStatusFormatter(props.status),
    [props.status],
  );

  return label ? <Tag color={color ?? ''}>{label}</Tag> : null;
};
