import { useEffect, useRef, useState } from 'react';

import { Button, Empty, Slider, Typography } from 'antd';

import { lighten } from '@/shared/lib/color';
import { useTheme } from '@/shared/lib/theme';
import { Flex } from '@/shared/ui/flex';
import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  LinkBreakIcon,
  LinkSimpleIcon,
  PauseIcon,
  PlayIcon,
} from '@phosphor-icons/react';
import ReactPlayer from 'react-player';

const { Text } = Typography;

const SEEK_SECONDS = 15;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export type VideoPlayerProps = {
  url: string;
  active?: boolean;
};

export const VideoPlayer = ({ url, active }: VideoPlayerProps) => {
  const { token } = useTheme();

  const playerRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const seek = (time: number) => {
    if (!playerRef.current) return;

    const value = Math.max(0, Math.min(time, duration));

    playerRef.current.currentTime = value;

    setCurrentTime(value);
  };

  const togglePlay = async () => {
    if (!playerRef.current) return;

    if (playing) {
      playerRef.current.pause();
    } else {
      await playerRef.current.play();
    }

    setPlaying(!playing);
  };

  const resetState = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.currentTime = 0;
    }

    setPlaying(false);
    setCurrentTime(0);
    setSeeking(false);
  };

  useEffect(() => {
    if (!active) resetState();
  }, [active]);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (playerRef.current && !seeking) {
        setCurrentTime(playerRef.current.currentTime);
      }
      rafRef.current = requestAnimationFrame(update);
    };

    if (playing) {
      rafRef.current = requestAnimationFrame(update);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [playing, seeking]);

  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    resetState();
  }, [url]);

  if (error) {
    return (
      <Flex
        vertical
        height="100%"
        width="100%"
        justify="center"
        align="center"
        gap={token.padding}
      >
        <Empty
          description="Ошибка при загрузке видео"
          image={<LinkBreakIcon weight="light" size={80} />}
        />

        <Button
          type="primary"
          href={url}
          target="_blank"
          style={{ backgroundColor: token.colorInfo }}
          icon={<LinkSimpleIcon />}
          rel="noopener noreferrer"
        >
          Посмотреть по ссылке
        </Button>
      </Flex>
    );
  }

  return (
    <Flex height="100%" width="100%">
      <ReactPlayer
        playsInline
        ref={playerRef}
        src={url}
        width="100%"
        height="100%"
        controls={false}
        playing={playing}
        onError={() => {
          setError(true);
          resetState();
        }}
        onDurationChange={() => {
          if (!playerRef.current) return;

          setDuration(playerRef.current.duration);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <Flex
        width="100%"
        px={token.paddingXS}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        <Flex vertical={false} align="center">
          <Text style={{ flexBasis: 40, textAlign: 'left' }}>
            {formatTime(currentTime)}
          </Text>

          <Slider
            min={0}
            max={duration || 0}
            value={currentTime}
            tooltip={{ open: false }}
            style={{ flex: 1 }}
            onChange={(value) => {
              setSeeking(true);
              setCurrentTime(value);
            }}
            onChangeComplete={(value) => {
              seek(value);
              setSeeking(false);
            }}
          />

          <Text style={{ flexBasis: 40, textAlign: 'right' }}>
            {formatTime(duration - currentTime)}
          </Text>
        </Flex>

        <Flex
          vertical={false}
          justify="center"
          gap={token.padding}
          align="center"
        >
          <Flex vertical={false} align="center" gap={token.paddingXS}>
            15s
            <ArrowUUpLeftIcon
              onClick={() => seek(currentTime - SEEK_SECONDS)}
            />
          </Flex>

          <Button
            shape="circle"
            size="large"
            style={{
              color: lighten(token.colorBgLayout, 0.5),
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
            icon={
              playing ? <PauseIcon weight="fill" /> : <PlayIcon weight="fill" />
            }
            onClick={togglePlay}
          />

          <Flex vertical={false} align="center" gap={token.paddingXS}>
            <ArrowUUpRightIcon
              onClick={() => seek(currentTime + SEEK_SECONDS)}
            />
            15s
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
