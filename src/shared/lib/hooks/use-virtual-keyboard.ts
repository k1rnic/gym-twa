import { RefSelectProps } from 'antd';
import { RefObject, useEffect, useRef, useState } from 'react';

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handler = () => {
      const heightDiff = window.innerHeight - viewport.height;
      setKeyboardHeight(heightDiff > 0 ? heightDiff : 0);
    };

    viewport.addEventListener('resize', handler);
    return () => viewport.removeEventListener('resize', handler);
  }, []);

  return keyboardHeight;
};

export const useSelectKeyboardDistance = (ref: RefObject<RefSelectProps>) => {
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport || !ref.current?.nativeElement) return;

    const update = () => {
      const rect = ref.current!.nativeElement.getBoundingClientRect();
      const d = viewport.height - rect.bottom;
      setDistance(d);
    };

    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    update();

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, [ref]);

  return distance;
};

export const useVirtualKeyboardOpened = () => {
  const [isOpen, setIsOpen] = useState(false);

  const initialHeight = useRef<number>();

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    initialHeight.current = viewport.height;

    const handleResize = () => {
      const keyboardHeight =
        (initialHeight.current ?? viewport.height) - viewport.height;

      setIsOpen(keyboardHeight > 150);
    };

    viewport.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return isOpen;
};
