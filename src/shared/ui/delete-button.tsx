import { Button } from 'antd';
import { ButtonProps } from 'antd/lib';
import { PropsWithChildren } from 'react';

type DeleteButtonProps = {
  onDelete: () => void;
} & ButtonProps;

export const DeleteButton = ({
  children,
  onDelete,
  ...buttonProps
}: PropsWithChildren<DeleteButtonProps>) => {
  return (
    <Button danger type="primary" onClick={onDelete} {...buttonProps}>
      {children || 'Удалить'}
    </Button>
  );
};
