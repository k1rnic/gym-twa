import { formatUserFullName } from '@/entities/user/lib';
import { User } from '@/shared/api';
import { useToggle } from '@/shared/lib/hooks';
import { Modal, Typography } from 'antd';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  readOnly?: boolean;
  user: Pick<User, 'telegram_id' | 'username' | 'first_name' | 'last_name'>;
  style?: CSSProperties;
};

export const UserTgLink = ({ user, readOnly, style }: Props) => {
  const [opened, toggle] = useToggle();
  const { t } = useTranslation();

  const goToChat = () => {
    window.open(`https://t.me/${user.username}`, '_blank');
    toggle();
  };

  return (
    <>
      <Typography.Link
        hidden={!user.username}
        target="_blank"
        disabled={!user.username || readOnly}
        onClick={toggle}
        style={style}
      >
        @{user.username}
      </Typography.Link>

      <Modal
        centered
        title={t('profile.confirmChat.title')}
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
          {t('profile.confirmChat.message', { name: formatUserFullName(user) })}
        </Typography.Paragraph>
      </Modal>
    </>
  );
};
