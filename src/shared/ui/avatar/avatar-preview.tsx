import emptyAvatar from '@/shared/assets/empty-avatar.png';
import { Image } from 'antd';

export type AvatarPreviewProps = {
  photos: string[];
} & Pick<Parameters<typeof Image.PreviewGroup>[0], 'preview'>;

export const AvatarPreview = ({ photos, preview }: AvatarPreviewProps) => {
  return (
    <Image.PreviewGroup items={photos ?? []} preview={preview}>
      <Image
        width={100}
        height={100}
        style={{ borderRadius: '50%' }}
        src={photos?.[0]}
        fallback={emptyAvatar}
        preview={{ mask: null }}
      />
    </Image.PreviewGroup>
  );
};
