import { backButton } from '@tma.js/sdk-react';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

export const useNavigateBackButton = () => {
  const navigate = useNavigate();

  return useCallback(() => {
    const idx = window.history.state?.idx;

    if (typeof idx === 'number' && idx > 0) {
      navigate(-1);
    } else {
      navigate('..', { relative: 'path' });
    }
  }, [navigate]);
};

type UseTelegramBackOptions = {
  beforeUnmount?: () => Promise<unknown> | unknown;
};

export const useTelegramBackButton = ({
  beforeUnmount,
}: UseTelegramBackOptions = {}) => {
  const goBack = useNavigateBackButton();

  const beforeUnmountRef = useRef(beforeUnmount);

  const goBackWithHandler = useCallback(async () => {
    try {
      await beforeUnmountRef.current?.();
      goBack();
    } catch (e) {
      console.error(e);
    }
  }, [goBack]);

  // const goBack = useCallback(async () => {
  //   try {
  //     await beforeUnmountRef.current?.();

  //     const idx = window.history.state?.idx;

  //     if (typeof idx === 'number' && idx > 0) {
  //       navigate(-1);
  //     } else {
  //       navigate('..', { relative: 'path' });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [navigate]);

  useEffect(() => {
    beforeUnmountRef.current = beforeUnmount;
  }, [beforeUnmount]);

  useEffect(() => {
    backButton.show();

    return () => backButton.hide();
  }, []);

  useEffect(() => {
    backButton.onClick(goBackWithHandler, true);

    return () => backButton.offClick(goBackWithHandler, true);
  }, [goBackWithHandler]);
};
