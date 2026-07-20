import type { NotificationInstance } from 'antd/es/notification/interface';
import type { ReactNode } from 'react';

type NotifyContent = ReactNode;

let notificationApi: NotificationInstance | null = null;

export const setNotificationApi = (api: NotificationInstance) => {
  notificationApi = api;
};

const open = (
  type: 'success' | 'error' | 'info' | 'warning',
  content: NotifyContent,
) => {
  notificationApi?.[type]({ message: content });
};

export const notify = {
  success: (content: NotifyContent) => open('success', content),
  error: (content: NotifyContent) => open('error', content),
  info: (content: NotifyContent) => open('info', content),
  warning: (content: NotifyContent) => open('warning', content),
};
