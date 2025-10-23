import { Button } from 'antd';
import { PropsWithChildren } from 'react';

type DeleteButtonProps = {
  onDelete: () => void;
};

export const DeleteButton = ({
  children,
  onDelete,
}: PropsWithChildren<DeleteButtonProps>) => {
  return (
    <Button block size="middle" danger type="primary" onClick={onDelete}>
      {children || 'Удалить'}
    </Button>
  );
};
