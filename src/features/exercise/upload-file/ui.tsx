import { Api, UrlPathType } from '@/shared/api';
import { useFilePicker } from '@/shared/lib/file';
import { useTheme } from '@/shared/lib/theme';
import { isVideoUrl } from '@/shared/lib/video';
import { Flex } from '@/shared/ui/flex';
import {
  Button,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';

export type ExerciseUploadFileModalProps = {
  exerciseId: number;
  opened: boolean;
  onClose?: () => void;
};

export const ExerciseUploadFileModal = (
  props: ExerciseUploadFileModalProps,
) => {
  const { token } = useTheme();
  const { revalidate } = useRevalidator();

  const [mode, setMode] = useState<'link' | 'file'>('link');
  const [url, setUrl] = useState('');

  const [files, openFilePicker, clearFileList] = useFilePicker({
    accept: 'image/*,video/*',
    multiple: false,
  });

  useEffect(() => {
    if (!props.opened) {
      setUrl('');
      setMode('link');
      clearFileList();
    }
  }, [props.opened]);

  const onSubmitLink = async () => {
    try {
      const detectedType = isVideoUrl(url)
        ? UrlPathType.Video
        : UrlPathType.Image;

      await Api.exercise.addExerciseLink(props.exerciseId, {
        link: url,
        type_link: detectedType,
      });
      message.success('Ссылка добавлена');
      revalidate();
      props.onClose?.();
    } catch (e) {
      message.error('Не удалось добавить ссылку');
    }
  };

  const onSubmitFile = async () => {
    try {
      if (!files[0]) return message.error('Файл не выбран');
      await Api.exercise.addExerciseImage(props.exerciseId, {
        image: files[0],
      });
      message.success('Файл загружен');
      revalidate();
      clearFileList();
      props.onClose?.();
    } catch (e) {
      message.error('Не удалось загрузить файл');
    }
  };

  return (
    <Modal
      centered
      height="400"
      title="Добавить файл"
      open={props.opened}
      onCancel={props.onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <Flex vertical gap={token.paddingSM} py={token.paddingContentVertical}>
        <Radio.Group
          value={mode}
          onChange={(e: RadioChangeEvent) => setMode(e.target.value)}
        >
          <Radio value="link">Вставить ссылку</Radio>
          <Radio value="file">Загрузить файл</Radio>
        </Radio.Group>

        {mode === 'link' ? (
          <Flex align="center" gap={token.paddingSM} vertical={false}>
            <Input
              placeholder="Вставьте ссылку"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button type="primary" disabled={!url} onClick={onSubmitLink}>
              Вставить
            </Button>
          </Flex>
        ) : (
          <Flex align="flex-start" gap={token.paddingSM} vertical={false}>
            <Flex flex={1} gap={token.paddingSM}>
              <Button block onClick={openFilePicker}>
                Выбрать файл
              </Button>
              <Typography.Text hidden={!files.length}>
                Файл: {files[0]?.name}
              </Typography.Text>
            </Flex>

            <Button
              type="primary"
              size="small"
              disabled={!files[0]}
              onClick={onSubmitFile}
            >
              Загрузить
            </Button>
          </Flex>
        )}
      </Flex>
    </Modal>
  );
};

export default ExerciseUploadFileModal;
