import { UrlPathType } from '@/shared/api';
import { useLimitedList, useVideoThumbnail } from '@/shared/lib/hooks';
import { useViewport } from '@/shared/lib/telegram';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  CloseOutlined,
  LeftOutlined,
  PictureOutlined,
  PlusOutlined,
  RightOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Col, Drawer, Image, Row, Skeleton } from 'antd';
import { RowProps } from 'antd/lib';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import classes from './styles.module.css';

const Player = ReactPlayer;

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

const DEFAULT_MAX_VISIBLE = 18;
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
  const [openPreviewOnNextItemsChange, setOpenPreviewOnNextItemsChange] =
    useState(false);
  const prevItemsLengthRef = useRef(items.length);

  const tileSpan = GRID_SIZE / cols;
  const visibleItems = visible;
  const previewCount = hasHidden
    ? visibleItems.length + 1
    : visibleItems.length;

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const handleAddClick = () => {
    setOpenPreviewOnNextItemsChange(true);
    props.onAddClick?.();
  };

  useEffect(() => {
    if (items.length <= previewIndex) {
      setPreviewIndex(Math.max(items.length - 1, 0));
    }
  }, [items.length, previewIndex]);

  useEffect(() => {
    if (
      openPreviewOnNextItemsChange &&
      items.length > prevItemsLengthRef.current
    ) {
      setPreviewIndex(items.length - 1);
      setPreviewVisible(true);
      setOpenPreviewOnNextItemsChange(false);
    }

    prevItemsLengthRef.current = items.length;
  }, [items.length, openPreviewOnNextItemsChange]);

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

  return (
    <>
      <Row gutter={gutter}>
        {visibleItems.map((item, index) => (
          <Col span={tileSpan} key={item.url || index}>
            <div
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              <Image
                src={
                  item.type === UrlPathType.Video
                    ? thumbs[item.url] ?? item.url
                    : item.url
                }
                placeholder={<SkeletonTile />}
                preview={false}
                width="100%"
                height="100%"
                style={baseTileStyles}
                onClick={() => openPreview(index)}
              />

              <div className={classes.overlayIcon}>
                {item.type === UrlPathType.Video ? (
                  <VideoCameraOutlined />
                ) : (
                  <PictureOutlined />
                )}
              </div>
            </div>
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
            icon={<PlusOutlined />}
            onClick={handleAddClick}
          />
        </Col>
      </Row>

      <Drawer
        destroyOnHidden
        closable={false}
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        placement="bottom"
        height={`calc(95% - ${topSafeArea}px)`}
        styles={{
          header: { flexDirection: 'row-reverse', padding: 0 },
          body: { padding: 0 },
          content: {
            borderTopLeftRadius: token.borderRadiusLG,
            borderTopRightRadius: token.borderRadiusLG,
          },
        }}
        title={
          <Flex
            vertical={false}
            justify="space-between"
            style={{ textAlign: 'center' }}
          >
            <Button
              size="large"
              type="text"
              onClick={() => setPreviewVisible(false)}
              icon={<CloseOutlined />}
            />

            {renderToolbar && renderToolbar(<></>, { current: previewIndex })}
          </Flex>
        }
      >
        <Flex vertical height="100%">
          <div className={classes.viewerMain}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              disabled={previewIndex === 0}
              className={classes.navButtonLeft}
              onClick={() =>
                setPreviewIndex((value) => (value > 0 ? value - 1 : value))
              }
            />

            {items[previewIndex]?.type === UrlPathType.Video ? (
              <Player
                key={items[previewIndex].url}
                src={items[previewIndex].url}
                controls
                width="100%"
                height="100%"
              />
            ) : (
              <Image
                src={items[previewIndex]?.url}
                width="100%"
                height="100%"
                style={{ objectFit: 'contain' }}
                preview={false}
              />
            )}

            <Button
              shape="circle"
              icon={<RightOutlined />}
              disabled={previewIndex === items.length - 1}
              className={classes.navButtonRight}
              onClick={() =>
                setPreviewIndex((value) =>
                  value < items.length - 1 ? value + 1 : value,
                )
              }
            />
          </div>

          <div className={classes.thumbnailStrip}>
            <Swiper
              slidesPerView="auto"
              spaceBetween={6}
              style={{
                width: '100%',
                height: '100%',
                paddingBottom: token.paddingXL,
              }}
            >
              {items.map((it, i) => (
                <SwiperSlide
                  key={it.url + i}
                  style={{
                    width: 'auto',
                    minWidth: 68,
                    maxWidth: 68,
                    height: 68,
                  }}
                >
                  <div
                    onClick={() => setPreviewIndex(i)}
                    className={classes.thumbnailItem}
                    style={{
                      border:
                        i === previewIndex
                          ? `2px solid ${token.colorPrimary}`
                          : 'none',
                    }}
                  >
                    <Image
                      src={thumbs[it.url] ?? it.url}
                      width="100%"
                      height="100%"
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                      preview={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Flex>
      </Drawer>
    </>
  );
};
