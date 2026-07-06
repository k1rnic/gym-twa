import { backButton } from '@tma.js/sdk-react';
import { useCallback, useEffect, useMemo } from 'react';
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

export const useTelegramBackButton = () => {
  const goBack = useNavigateBackButton();

  useEffect(() => {
    backButton.onClick(goBack);

    return () => backButton.offClick(goBack);
  }, [goBack]);

  return useMemo(() => ({ show: backButton.show, hide: backButton.hide }), []);
};
