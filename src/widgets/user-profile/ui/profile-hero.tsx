import { User } from '@/shared/api';
import { alpha } from '@/shared/lib/color';
import { useTheme } from '@/shared/lib/theme';
import { FadeImage } from '@/shared/ui/fade-image';
import { Flex } from '@/shared/ui/flex';
import { CameraSlashIcon, GearSixIcon, PlusIcon } from '@phosphor-icons/react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Keyboard, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import classes from './profile-hero-styles.module.css';

export type ProfileHeroProps = {
  user: Omit<User, 'user_id'>;
  onUpload?: (file: RcFile) => Promise<void>;
  onDeletePhoto?: (url: string) => Promise<void> | void;
  toolbarHidden?: boolean;
};

export const ProfileHero = ({
  user,
  onUpload,
  onDeletePhoto,
  toolbarHidden = true,
}: ProfileHeroProps) => {
  const { token } = useTheme();

  const photos = useMemo(
    () => user.photos ?? ([user.photo].filter(Boolean) as string[]),
    [user.photos, user.photo],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const currentPhoto = useMemo(
    () => photos[activeIndex],
    [photos, activeIndex],
  );

  const uploadProps: UploadProps = {
    accept: 'image/*',
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      await onUpload?.(file as RcFile);
      return false;
    },
  };

  const menuItems = useMemo<MenuProps['items']>(
    () =>
      toolbarHidden
        ? []
        : [
            {
              key: 'upload',
              icon: <PlusIcon />,
              label: (
                <Upload {...uploadProps}>
                  <span>Добавить фото</span>
                </Upload>
              ),
            },
            // {
            //   key: 'delete',
            //   danger: true,
            //   disabled: !currentPhoto,
            //   icon: <DeleteOutlined />,
            //   label: 'Удалить текущее фото',
            //   onClick: async () => {
            //     if (!currentPhoto) return;
            //     await onDeletePhoto?.(currentPhoto);
            //   },
            // },
          ],

    [toolbarHidden, uploadProps, currentPhoto],
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vw',
        maxHeight: '50vh',
      }}
    >
      {!toolbarHidden && (
        <Dropdown trigger={['click']} menu={{ items: menuItems }}>
          <Button
            size="large"
            type="text"
            shape="circle"
            icon={<GearSixIcon weight="fill" />}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              zIndex: 10,
              background: alpha(token.colorBgContainer, 0.5),
              backdropFilter: 'blur(4px)',
            }}
          />
        </Dropdown>
      )}

      {photos.length ? (
        <Swiper
          loop
          style={{ width: '100%', height: '100%' }}
          modules={[Pagination, Keyboard]}
          keyboard={{ enabled: true, pageUpDown: true, onlyInViewport: true }}
          pagination={{ clickable: true, bulletActiveClass: classes.active }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {photos.map((photo) => (
            <SwiperSlide key={photo}>
              <FadeImage image={photo} bg={token.colorBgContainer} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Flex height="100%" width="100%" align="center" justify="center">
          <CameraSlashIcon
            weight="light"
            color={token.colorTextDisabled}
            size="30%"
          />
        </Flex>
      )}
    </div>
  );
};
