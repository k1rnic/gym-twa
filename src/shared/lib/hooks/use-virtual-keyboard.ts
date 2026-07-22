import { RefSelectProps } from 'antd';
import { RefObject, useEffect, useState } from 'react';

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

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;

  const userAgentData = (
    navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData;

  if (userAgentData?.mobile !== undefined) {
    return userAgentData.mobile;
  }

  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

const isTextInput = (element: Element | null): boolean => {
  if (element instanceof HTMLTextAreaElement) return !element.disabled;

  if (element instanceof HTMLInputElement) {
    return (
      !element.disabled &&
      ![
        'button',
        'checkbox',
        'file',
        'hidden',
        'image',
        'radio',
        'reset',
        'submit',
      ].includes(element.type)
    );
  }

  return element instanceof HTMLElement && element.isContentEditable;
};

export const useVirtualKeyboardOpened = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isMobileDevice()) return;

    let blurTimer: number | undefined;

    const updateState = () => {
      setIsOpen(isTextInput(document.activeElement));
    };

    const handleFocusIn = () => {
      window.clearTimeout(blurTimer);
      updateState();
    };

    const handleFocusOut = () => {
      blurTimer = window.setTimeout(updateState, 0);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    updateState();

    return () => {
      window.clearTimeout(blurTimer);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return isOpen;
};
