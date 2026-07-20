import { GymerMasterStatus } from '@/shared/api';
import i18next from 'i18next';

const statusLabels: Partial<Record<GymerMasterStatus, string>> = {
  [GymerMasterStatus.CurrentMaster]: 'profile.masterStatus.currentMaster',
  [GymerMasterStatus.AwaitedRequest]: 'profile.masterStatus.awaitedRequest',
  [GymerMasterStatus.RejectedRequest]: 'profile.masterStatus.rejectedRequest',
  [GymerMasterStatus.AcceptsRequests]: 'profile.masterStatus.acceptsRequests',
};

const statusColors: Partial<
  Record<GymerMasterStatus, 'success' | 'warning' | 'error' | 'processing'>
> = {
  [GymerMasterStatus.CurrentMaster]: 'success',
  [GymerMasterStatus.AwaitedRequest]: 'warning',
  [GymerMasterStatus.RejectedRequest]: 'error',
  [GymerMasterStatus.AcceptsRequests]: 'processing',
};

export const masterStatusFormatter = (status?: GymerMasterStatus | null) => {
  return {
    label: status ? i18next.t(statusLabels[status] ?? '') : null,
    color: statusColors[status!] ?? null,
  };
};
