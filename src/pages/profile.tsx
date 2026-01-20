import { viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';

import { Flex } from '@/shared/ui/flex';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Space,
  Typography,
  Upload,
  message,
} from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { formatUserDisplayName } from '@/entities/user';
import { AvatarPreview } from '@/shared/ui/avatar';
import { Breadcrumbs } from '@/shared/ui/breadcrumbs';

const { Title, Text } = Typography;

const mapInitialValues = (
  viewer: ReturnType<typeof viewerModel.useViewer>,
) => ({
  description: viewer.master?.description ?? '',
  is_private: viewer.master?.is_private ?? false,
});

export default function Page() {
  const viewer = viewerModel.useViewer();
  const setViewer = viewerModel.useSetViewer();
  const navigate = useNavigate();
  const [form] = Form.useForm<ReturnType<typeof mapInitialValues>>();

  const [uploading, setUploading] = useState(false);

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
    setUploading(true);
    try {
      await Api.user.addUserImage(viewer.user_id, { image: file });
      await refreshViewer();
      message.success('Фотография загружена');
    } catch (e) {
      message.error('Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      await uploadFile(file as RcFile);
      return false;
    },
  };

  const saveProfile = async () => {
    const values = form.getFieldsValue();
    await Api.user.updateMasterProfile(viewer.master!.master_id!, {
      description: values.description ?? '',
      is_private: !!values.is_private,
    });
    await refreshViewer();
    message.success('Профиль обновлён');
  };

  return (
    <Flex gap="small" style={{ overflow: 'auto', width: '100%' }}>
      <Breadcrumbs items={[{ title: 'Профиль' }]} />
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Space direction="vertical" align="center">
              <AvatarPreview
                photos={viewer.photos ?? []}
                preview={{ toolbarRender: () => <></> }}
              />

              <Upload {...uploadProps}>
                <Button loading={uploading} icon={<PlusOutlined />}>
                  Добавить
                </Button>
              </Upload>
            </Space>

            <Space style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                {formatUserDisplayName(viewer)}
              </Title>
              <Text type="secondary">@{viewer.username}</Text>
            </Space>
          </Space>

          <Form form={form} layout="vertical" initialValues={initialValues}>
            <Form.Item name="description">
              <Input.TextArea
                placeholder="Расскажите о себе"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Form.Item name="is_private" valuePropName="checked">
              <Checkbox>Скрыть профиль</Checkbox>
            </Form.Item>

            <Button block size="large" type="primary" onClick={saveProfile}>
              Сохранить изменения
            </Button>
          </Form>
        </Space>
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>
            Действия
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button block onClick={() => navigate('/profile/masters')}>
              Управление тренерами
            </Button>
            <Button block onClick={() => navigate('/profile/requests')}>
              Заявки на прикрепление
            </Button>
          </Space>
        </Space>
      </Card>
    </Flex>
  );
}
