import { useMemo, useState } from 'react';

import { Upload } from 'antd';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { User } from '@/shared/api';
import type { RcFile, UploadProps } from 'antd/es/upload';

import { useTheme } from '@/shared/lib/theme';
import { FadeImage } from '@/shared/ui/fade-image';
import 'swiper/css';
import 'swiper/css/pagination';
import { Keyboard, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export type ProfileHeroProps = {
  user: User;
  onUpload?: (file: RcFile) => Promise<void>;
  onDeletePhoto?: (url: string) => Promise<void> | void;
};

export const ProfileHero = ({
  user,
  onUpload,
  onDeletePhoto,
}: ProfileHeroProps) => {
  const { token } = useTheme();

  const [photos] = useState(user.photos ?? []);
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

  const menuItems = [
    {
      key: 'upload',
      icon: <PlusOutlined />,
      label: (
        <Upload {...uploadProps}>
          <span>Добавить фото</span>
        </Upload>
      ),
    },

    {
      key: 'delete',
      danger: true,
      disabled: !currentPhoto,
      icon: <DeleteOutlined />,
      label: 'Удалить текущее фото',

      onClick: async () => {
        if (!currentPhoto) return;

        await onDeletePhoto?.(currentPhoto);
      },
    },
  ];

  return (
    <Swiper
      loop
      style={{ width: '100%', height: '100vw', maxHeight: '40vh' }}
      modules={[Pagination, Keyboard]}
      keyboard={{ enabled: true, pageUpDown: true, onlyInViewport: true }}
      pagination={{ clickable: true }}
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
    >
      {photos.map((photo) => (
        <SwiperSlide key={photo}>
          <FadeImage image={photo} bg={token.colorBgContainer} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
