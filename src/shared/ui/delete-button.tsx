import { Button } from 'antd';
import { ButtonProps } from 'antd/lib';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type DeleteButtonProps = {
  onDelete: () => void;
} & ButtonProps;

export const DeleteButton = ({
  children,
  onDelete,
  ...buttonProps
}: PropsWithChildren<DeleteButtonProps>) => {
  const { t } = useTranslation();

  return (
    <Button danger type="primary" onClick={onDelete} {...buttonProps}>
      {children || t('common.delete')}
    </Button>
  );
};
