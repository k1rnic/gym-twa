import { Flex } from '@/shared/ui/flex';
import { Button, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useExerciseVideoPicker } from './lib';

export type ExerciseVideoUploadModalProps = {
  exerciseId: number;
  opened: boolean;
  onClose?: () => void;
};

export const ExerciseVideoUploadModal = (
  props: ExerciseVideoUploadModalProps,
) => {
  const uploadVideo = useExerciseVideoPicker(props.exerciseId);

  const [url, setUrl] = useState('');

  const onSubmit = async () => {
    await uploadVideo(url);
    props.onClose?.();
  };

  useEffect(() => {
    if (!props.opened) {
      setUrl('');
    }
  }, [props.opened]);

  return (
    <Modal
      centered
      title="Ссылка на видео"
      open={props.opened}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      styles={{
        content: { display: 'flex', flexDirection: 'column' },
        header: { textAlign: 'center' },
        body: { textAlign: 'center' },
        footer: { display: 'flex' },
      }}
    >
      <Flex gap={16} align="center">
        <Input
          value={url}
          placeholder="Ссылка"
          size="middle"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="primary" disabled={!url} onClick={onSubmit}>
          Вставить
        </Button>
      </Flex>
    </Modal>
  );
};
