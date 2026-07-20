import { useViewport } from '@/shared/lib/telegram';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { XIcon } from '@phosphor-icons/react';
import { Button, Checkbox, Drawer, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PolicyContent } from './policy-content';

type PolicyDrawerBaseProps = {
  open: boolean;
};

type PolicyConsentDrawerProps = PolicyDrawerBaseProps & {
  mode: 'consent';
  loading?: boolean;
  onAccept: () => void;
};

type PolicyViewDrawerProps = PolicyDrawerBaseProps & {
  mode: 'view';
  onClose: () => void;
};

export type PolicyDrawerProps =
  | PolicyConsentDrawerProps
  | PolicyViewDrawerProps;

export const PolicyDrawer = (props: PolicyDrawerProps) => {
  const { open, mode } = props;
  const { t } = useTranslation();
  const { token } = useTheme();
  const { topSafeArea, bottomSafeArea } = useViewport();

  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!open) {
      setAgreed(false);
    }
  }, [open]);

  return (
    <Drawer
      destroyOnHidden
      closable={false}
      maskClosable={false}
      keyboard={false}
      open={open}
      placement="bottom"
      height={`calc(90% - ${topSafeArea}px)`}
      styles={{
        header: { padding: 0 },
        body: {
          padding: token.paddingSM,
          paddingBottom: bottomSafeArea,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
      title={
        <Flex
          align="center"
          vertical={false}
          justify="space-between"
          style={{ textAlign: 'center' }}
          py={token.padding}
          px={token.paddingSM}
        >
          {mode === 'view' ? (
            <Button
              size="large"
              type="text"
              onClick={props.onClose}
              icon={<XIcon />}
            />
          ) : (
            <span style={{ width: 40 }} />
          )}

          <Typography.Title level={5} style={{ margin: 0, flex: 1 }}>
            {t('policy.title')}
          </Typography.Title>

          <span style={{ width: 40 }} />
        </Flex>
      }
      onClose={mode === 'view' ? props.onClose : undefined}
    >
      <Flex height="100%" gap={token.paddingSM} style={{ overflow: 'hidden' }}>
        <Flex flex={1} style={{ overflowY: 'auto', minHeight: 0 }}>
          <PolicyContent />
        </Flex>

        {mode === 'consent' && (
          <Flex gap={token.paddingSM}>
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            >
              {t('policy.agree')}
            </Checkbox>

            <Button
              block
              size="large"
              type="primary"
              disabled={!agreed}
              loading={props.loading}
              onClick={props.onAccept}
            >
              {t('policy.continue')}
            </Button>
          </Flex>
        )}
      </Flex>
    </Drawer>
  );
};
