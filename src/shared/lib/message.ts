import type {
  ArgsProps,
  JointContent,
  MessageInstance,
  MessageType,
  NoticeType,
} from 'antd/es/message/interface';

let messageApi: MessageInstance | null = null;

export const setMessageApi = (api: MessageInstance) => {
  messageApi = api;
};

const open =
  (type: NoticeType) =>
  (content: JointContent): MessageType | undefined =>
    messageApi?.[type](content);

export const message = {
  success: open('success'),
  error: open('error'),
  info: open('info'),
  warning: open('warning'),
  loading: open('loading'),
  open: (args: ArgsProps) => messageApi?.open(args),
  destroy: () => messageApi?.destroy(),
};
