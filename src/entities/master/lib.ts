import { GymerMasterStatus } from '@/shared/api';

const statusLabels: Partial<Record<GymerMasterStatus, string>> = {
  [GymerMasterStatus.CurrentMaster]: 'Уже тренирует',
  [GymerMasterStatus.AwaitedRequest]: 'Заявка отправлена',
  [GymerMasterStatus.RejectedRequest]: 'Заявка отклонена',
  [GymerMasterStatus.AcceptsRequests]: 'Доступен для заявок',
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
    label: statusLabels[status!] ?? null,
    color: statusColors[status!] ?? null,
  };
};
