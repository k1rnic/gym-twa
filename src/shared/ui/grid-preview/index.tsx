import { UrlPathType } from '@/shared/api';
import { useLimitedList, useVideoThumbnail } from '@/shared/lib/hooks';
import { useViewport } from '@/shared/lib/telegram';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import { VideoPlayer } from '@/shared/ui/player';
import { ImageIcon, PlusIcon, VideoIcon, XIcon } from '@phosphor-icons/react';
import { Button, Col, Drawer, Image, Row, Skeleton, Typography } from 'antd';
import { RowProps } from 'antd/lib';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import classes from './styles.module.css';

const baseTileStyles: CSSProperties = {
  cursor: 'pointer',
  objectFit: 'cover',
  aspectRatio: '1 / 1',
  borderRadius: 8,
};

const SkeletonTile = () => (
  <Skeleton.Image
    className={classes.skeleton}
    style={{ width: '100%', height: '100%', ...baseTileStyles }}
  />
);

type TileProps = {
  item: GridFileItem;
  onClick?: () => void;
  previewSrc: string;
  selected?: boolean;
};

const Tile = ({ item, previewSrc, selected, onClick }: TileProps) => {
  const { token } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: token.borderRadius,
        border: selected ? `2px solid ${token.colorPrimary}` : 'none',
      }}
    >
      <div style={{ position: 'relative' }}>
        {previewSrc ? (
          <Image
            src={previewSrc}
            placeholder={<SkeletonTile />}
            preview={false}
            width="100%"
            height="100%"
            style={baseTileStyles}
          />
        ) : (
          <SkeletonTile />
        )}
      </div>

      <div className={classes.overlayIcon}>
        {item.type === UrlPathType.Video ? (
          <VideoIcon weight="light" size={18} />
        ) : (
          <ImageIcon weight="light" size={18} />
        )}
      </div>
    </div>
  );
};

const DEFAULT_MAX_VISIBLE = 10;
const DEFAULT_COLS = 4;
const GRID_SIZE = 24;

export type GridFileItem = {
  url: string;
  type?: UrlPathType | string | null;
};

export type GridPreviewProps = {
  items: GridFileItem[];
  cols?: number;
  visibleCount?: number;
  readOnly?: boolean;
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
  const { topSafeArea } = useViewport();

  const {
    gutter = [8, 8],
    cols = DEFAULT_COLS,
    visibleCount = DEFAULT_MAX_VISIBLE,
    items,
    renderToolbar,
  } = props;

  const { visible, hidden, hiddenCount, hasHidden } = useLimitedList(
    items,
    visibleCount,
  );

  const getThumbnails = useVideoThumbnail();

  const [thumbs, setThumbs] = useState<Record<string, string | null>>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const tileSpan = GRID_SIZE / cols;
  const visibleItems = visible;

  const getPreviewSrc = (item: GridFileItem) => {
    if (item.type !== UrlPathType.Video) {
      return item.url ?? '';
    }

    return thumbs[item.url] ?? '';
  };

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const handleAddClick = () => {
    props.onAddClick?.();
  };

  useEffect(() => {
    if (items.length <= previewIndex) {
      setPreviewIndex(Math.max(items.length - 1, 0));
    }
  }, [items.length, previewIndex]);

  useEffect(() => {
    const videoItems = items
      .filter((i) => i?.type === UrlPathType.Video)
      .map((i) => i.url);

    videoItems.forEach((url) => {
      if (thumbs[url] !== undefined) return;
      getThumbnails(url).then(({ thumb }) => {
        setThumbs((prev) => ({ ...prev, [url]: thumb ?? null }));
      });
    });
  }, [items, getThumbnails, thumbs]);

  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const thumbsSwiperRef = useRef<SwiperClass | null>(null);

  const syncToIndex = (index: number) => {
    setPreviewIndex(index);

    if (mainSwiperRef.current?.activeIndex !== index) {
      mainSwiperRef.current?.slideTo(index);
    }

    if (thumbsSwiperRef.current) {
      thumbsSwiperRef.current.slideTo(index);
    }
  };

  useEffect(() => {
    if (!previewVisible) return;
    requestAnimationFrame(() => {
      mainSwiperRef.current?.slideTo(previewIndex, 0);
      thumbsSwiperRef.current?.slideTo(previewIndex, 0);
    });
  }, [previewVisible]);

  return (
    <>
      <Row gutter={gutter}>
        {visibleItems.map((item, index) => (
          <Col span={tileSpan} key={item.url + index}>
            <Tile
              item={item}
              previewSrc={getPreviewSrc(item)}
              onClick={() => openPreview(index)}
            />
          </Col>
        ))}

        {hasHidden && (
          <Col span={tileSpan}>
            <div
              onClick={() => openPreview(DEFAULT_MAX_VISIBLE)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                src={
                  (hidden[0]?.type === UrlPathType.Video &&
                    thumbs[hidden[0].url]) ||
                  hidden[0]?.url
                }
                placeholder={<SkeletonTile />}
                preview={false}
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

        <Col
          hidden={props.readOnly}
          span={tileSpan}
          className={classes.filePickerContainer}
          style={{ aspectRatio: '1/1' }}
        >
          <Button
            size="large"
            type="dashed"
            style={{ height: '100%', width: '100%' }}
            icon={<PlusIcon />}
            onClick={handleAddClick}
            className={classes.addButton}
          />
        </Col>
      </Row>

      <Drawer
        destroyOnHidden
        closable={false}
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        placement="bottom"
        height={`calc(90% - ${topSafeArea}px)`}
        styles={{ header: { padding: 0 }, body: { padding: 0 } }}
        title={
          <Flex
            align="center"
            vertical={false}
            justify="space-between"
            style={{ textAlign: 'center' }}
            py={token.padding}
          >
            <Button
              size="large"
              type="text"
              onClick={() => setPreviewVisible(false)}
              icon={<XIcon />}
            />

            <Typography.Title level={5} style={{ margin: 0 }}>{`${
              previewIndex + 1
            } из ${items.length}`}</Typography.Title>

            {renderToolbar && renderToolbar(<></>, { current: previewIndex })}
          </Flex>
        }
      >
        <Flex vertical height="100%">
          <Swiper
            style={{ width: '100%', flex: 1 }}
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              if (swiper.activeIndex !== previewIndex) {
                syncToIndex(swiper.activeIndex);
              }
            }}
          >
            {items.map((item, index) => (
              <SwiperSlide key={item.url + index}>
                {item?.type === UrlPathType.Video ? (
                  <VideoPlayer url={item.url} active={previewIndex === index} />
                ) : (
                  <Image
                    src={item?.url}
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover', aspectRatio: '1 / 1' }}
                    preview={false}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            slidesPerView="auto"
            spaceBetween={6}
            onSwiper={(swiper) => {
              thumbsSwiperRef.current = swiper;
            }}
            style={{
              width: '100%',
              padding: `${token.paddingXL}px ${token.paddingSM}px`,
            }}
          >
            {items.map((item, index) => (
              <SwiperSlide
                key={item.url + index}
                style={{ width: 68, height: 68 }}
              >
                <Tile
                  item={item}
                  selected={index === previewIndex}
                  previewSrc={getPreviewSrc(item)}
                  onClick={() => syncToIndex(index)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Flex>
      </Drawer>
    </>
  );
};
