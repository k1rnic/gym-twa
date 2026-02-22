import { formatUserDisplayName } from '@/entities/user/lib';
import { User } from '@/shared/api';
import { useToggle } from '@/shared/lib/hooks';
import { Modal, Typography } from 'antd';

type Props = {
  readonly?: boolean;
  user: Pick<User, 'telegram_id' | 'username' | 'first_name' | 'last_name'>;
};

export const UserTgLink = ({ user, readonly }: Props) => {
  const [opened, toggle] = useToggle();

  const goToChat = () => {
    window.open(`https://t.me/${user.username}`, '_blank');
    toggle();
  };

  return (
    <>
      <Typography.Link
        hidden={!user.username}
        target="_blank"
        disabled={!user.username || readonly}
        onClick={toggle}
      >
        @{user.username}
      </Typography.Link>

      <Modal
        centered
        title="Подтверждение перехода в чат"
        closable={false}
        maskClosable={false}
        open={opened}
        onOk={goToChat}
        onCancel={toggle}
        okButtonProps={{ size: 'middle', block: true }}
        cancelButtonProps={{ size: 'middle', block: true }}
        styles={{
          content: { display: 'flex', flexDirection: 'column' },
          header: { textAlign: 'center' },
          body: { textAlign: 'center' },
          footer: { display: 'flex' },
        }}
      >
        <Typography.Paragraph>
          Начать диалог с <b>{formatUserDisplayName(user)}</b>?
        </Typography.Paragraph>
      </Modal>
    </>
  );
};
