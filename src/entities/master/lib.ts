import { GymerMasterStatus } from '@/shared/api';

const statusLabels: Partial<Record<GymerMasterStatus, string>> = {
  [GymerMasterStatus.CurrentMaster]: 'Уже тренирует',
  [GymerMasterStatus.AwaitedRequest]: 'Заявка отправлена',
  [GymerMasterStatus.RejectedRequest]: 'Заявка отклонена',
  [GymerMasterStatus.AcceptsRequests]: 'Доступен для заявок',
};

const statusColors: Partial<
  Record<GymerMasterStatus, 'green' | 'orange' | 'red' | 'blue'>
> = {
  [GymerMasterStatus.CurrentMaster]: 'green',
  [GymerMasterStatus.AwaitedRequest]: 'orange',
  [GymerMasterStatus.RejectedRequest]: 'red',
  [GymerMasterStatus.AcceptsRequests]: 'blue',
};

export const masterStatusFormatter = (status?: GymerMasterStatus | null) => {
  return {
    label: statusLabels[status!] ?? null,
    color: statusColors[status!] ?? null,
  };
};
