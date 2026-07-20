import { viewerModel } from '@/entities/viewer';
import { PolicyDrawer } from '@/features/policy-consent';
import { Api } from '@/shared/api';

import { Flex } from '@/shared/ui/flex';
import { PageLayout } from '@/shared/ui/page-layout';
import { Card, Form, message, Select, Space, Typography } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteHandle, useNavigate } from 'react-router';

import { useTheme } from '@/shared/lib/theme';
import { ActionListItem } from '@/shared/ui/action-list-item';

export const handle: RouteHandle = { root: true };

import { useI18nContext } from '@/app/providers/with-i18n';
import {
  ProfileDescription,
  ProfileHero,
  ProfileName,
  ProfileToggle,
} from '@/widgets/user-profile';
import {
  BellIcon,
  CaretDownIcon,
  FileTextIcon,
  TranslateIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
const { Title } = Typography;

const mapInitialValues = (
  viewer: ReturnType<typeof viewerModel.useViewer>,
) => ({
  description: viewer.master?.description ?? '',
  is_private: viewer.master?.is_private ?? false,
});

export default function Page() {
  const { token } = useTheme();

  const viewer = viewerModel.useViewer();
  const setViewer = viewerModel.useSetViewer();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useI18nContext();
  const [form] = Form.useForm<ReturnType<typeof mapInitialValues>>();
  const [policyOpen, setPolicyOpen] = useState(false);

  const initialValues = useMemo(() => mapInitialValues(viewer), [viewer]);

  const refreshViewer = async () => {
    const fresh = await Api.user.getUserDataByTelegramId(
      viewer.telegram_id ?? viewer.user_id,
    );
    if (fresh) {
      setViewer(fresh);
    }
  };

  const uploadFile = async (file: RcFile) => {
    try {
      await Api.user.addUserImage(viewer.user_id, { image: file });
      await refreshViewer();
      message.success(t('profile.photoUploaded'));
    } catch (e) {
      message.error(t('profile.photoUploadFailed'));
    }
  };

  const updateProfileField = async (
    payload: Parameters<typeof Api.user.updateMasterProfile>[1],
  ) => {
    await Api.user.updateMasterProfile(viewer.master!.master_id!, payload);
    await refreshViewer();
  };

  return (
    <PageLayout pageStyle={{ paddingTop: 0 }} contentStyle={{ padding: 0 }}>
      <Flex height="100%" style={{ overflowY: 'auto' }}>
        <Flex style={{ position: 'relative' }}>
          <ProfileHero
            user={viewer}
            toolbarHidden={false}
            onUpload={uploadFile}
          />
          <ProfileName user={viewer} />
        </Flex>

        <Flex p={token.paddingSM} gap={token.paddingSM}>
          <Form form={form} layout="vertical" initialValues={initialValues}>
            <Form.Item name="description">
              <ProfileDescription
                onBlur={(e) =>
                  updateProfileField({ description: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              name="is_private"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <ProfileToggle
                onChange={(checked) =>
                  updateProfileField({ is_private: checked })
                }
              />
            </Form.Item>
          </Form>

          <Title level={4}>{t('profile.actions')}</Title>

          <Space direction="vertical" style={{ width: '100%' }}>
            <ActionListItem
              nav
              icon={<UsersThreeIcon weight="fill" size={28} />}
              onClick={() => navigate('/profile/masters')}
            >
              {t('profile.listMasters')}
            </ActionListItem>

            <ActionListItem
              nav
              icon={<UsersThreeIcon weight="fill" size={28} />}
              onClick={() => navigate('/profile/gymmers')}
            >
              {t('profile.myGymmers')}
            </ActionListItem>

            <ActionListItem
              nav
              icon={<BellIcon weight="fill" size={28} />}
              onClick={() => navigate('/profile/requests')}
            >
              {t('profile.requests')}
            </ActionListItem>
          </Space>

          <Title level={4}>{t('profile.settings')}</Title>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Card
              styles={{
                body: {
                  padding: token.paddingSM,
                  paddingLeft: token.paddingXXS,
                },
              }}
            >
              <Select
                value={language}
                onChange={setLanguage}
                style={{ width: '100%' }}
                prefix={
                  <TranslateIcon
                    size={28}
                    color={token.colorText}
                    style={{ marginRight: token.paddingSM }}
                  />
                }
                suffixIcon={<CaretDownIcon color={token.colorText} />}
                options={languages.map(({ code, nativeName }) => ({
                  value: code,
                  label: nativeName,
                }))}
              />
            </Card>

            <ActionListItem
              icon={<FileTextIcon weight="fill" size={28} />}
              onClick={() => setPolicyOpen(true)}
            >
              {t('profile.policy')}
            </ActionListItem>
          </Space>
        </Flex>
      </Flex>

      <PolicyDrawer
        mode="view"
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
      />
    </PageLayout>
  );
}
