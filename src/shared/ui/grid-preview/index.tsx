import { useLimitedList, useVideoThumbnail } from '@/shared/lib/hooks';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Image, Row, Skeleton } from 'antd';
import { RowProps } from 'antd/lib';
import { CSSProperties, useEffect, useState } from 'react';
import classes from './styles.module.css';

const baseTileStyles: CSSProperties = {
  cursor: 'pointer',
  objectFit: 'cover',
  aspectRatio: '1 / 1',
  borderRadius: 8,
};

const SkeletonTile = () => (
  <Skeleton.Image
    active
    style={{ width: '100%', height: '100%', ...baseTileStyles }}
  />
);

const DEFAUlT_MAX_VISIBLE = 6;
const DEFAULT_COLS = 4;
const GRID_SIZE = 24;

export type GridPreviewProps = {
  itemType: 'image' | 'video';
  items: string[];
  cols?: number;
  visibleCount?: number;
  readonly?: boolean;
  renderToolbar?: (
    origin: React.ReactElement,
    params: { current: number },
  ) => React.ReactNode;
  renderPreview?: (
    origin: React.ReactElement,
    params: { current: number },
  ) => React.ReactNode;
  onAddClick?: () => void;
} & Pick<RowProps, 'gutter'>;

export const GridPreview = (props: GridPreviewProps) => {
  const { token } = useTheme();
  const {
    gutter = [8, 8],
    cols = DEFAULT_COLS,
    visibleCount = DEFAUlT_MAX_VISIBLE,
    items,
    itemType,
    renderToolbar,
  } = props;

  const { visible, hidden, hiddenCount, hasHidden } = useLimitedList(
    items,
    visibleCount,
  );

  const getThumbnails = useVideoThumbnail();

  const [visiblePreviews, setVisiblePreviews] = useState<string[]>([]);
  const [hiddenThumbPreview, setHiddenThumbPreview] = useState<string>('');

  const tileSpan = GRID_SIZE / cols;

  const visibleItems = itemType === 'video' ? visiblePreviews : visible;
  const hiddenItems = itemType === 'video' ? hiddenThumbPreview : hidden[0];

  const previewCount = hasHidden
    ? visibleItems.length + 1
    : visibleItems.length;

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  useEffect(() => {
    if (items.length <= previewIndex) {
      setPreviewIndex(items.length - 1);
    }
  }, [items.length, previewIndex]);

  useEffect(() => {
    if (itemType !== 'video') return;
    Promise.all(visible.map(getThumbnails)).then((res) => {
      setVisiblePreviews(res.map(({ thumb }) => thumb ?? ''));
    });
  }, [visible, hidden, itemType, getThumbnails]);

  useEffect(() => {
    if (!hasHidden) return;
    getThumbnails(hidden[0]).then(({ thumb }) => {
      setHiddenThumbPreview(thumb ?? '');
    });
  }, [hasHidden, hidden]);

  return (
    <Row gutter={gutter}>
      <Image.PreviewGroup
        items={items}
        preview={{
          movable: false,
          visible: previewVisible && items.length > 0,
          current: previewIndex,
          closeIcon: null,
          onVisibleChange: setPreviewVisible,
          onChange: setPreviewIndex,
          toolbarRender: renderToolbar,
          imageRender:
            props.renderPreview || itemType === 'video'
              ? (_, { current }) => (
                  <video autoPlay width="100%" controls src={items[current]} />
                )
              : undefined,
        }}
      >
        {visibleItems.map((src, index) => (
          <Col span={tileSpan} key={src}>
            <Image
              src={src}
              placeholder={<SkeletonTile />}
              preview={{ mask: false }}
              width="100%"
              height="100%"
              style={baseTileStyles}
              onClick={() => openPreview(index)}
            />
          </Col>
        ))}

        {hasHidden && (
          <Col span={tileSpan}>
            <div
              onClick={() => openPreview(DEFAUlT_MAX_VISIBLE)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                src={hiddenItems}
                placeholder={<SkeletonTile />}
                preview={{ mask: false }}
                width="100%"
                height="100%"
                style={{ ...baseTileStyles, filter: 'blur(4px)' }}
              />

              <Flex
                align="center"
                justify="center"
                style={{
                  ...baseTileStyles,
                  position: 'absolute',
                  inset: 0,
                  color: token.colorWhite,
                  fontSize: 18,
                }}
              >
                +{hiddenCount}
              </Flex>
            </div>
          </Col>
        )}
      </Image.PreviewGroup>

      <Col
        hidden={props.readonly}
        span={tileSpan}
        className={classes.filePickerContainer}
        style={{ aspectRatio: previewCount === cols ? '1/1' : undefined }}
      >
        <Button
          size="large"
          type="dashed"
          icon={<PlusOutlined />}
          onClick={props.onAddClick}
        />
      </Col>
    </Row>
  );
};
