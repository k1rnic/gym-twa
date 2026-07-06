import { useTelegramBackButton } from '@/shared/lib/router';
import { useEffect, useMemo } from 'react';
import { useMatches } from 'react-router';

const ROOT_ROUTES = ['', '/'];

export const NavigationListener = () => {
  const matches = useMatches();
  const backButton = useTelegramBackButton();

  const isRoot = useMemo(() => {
    const last = matches.at(-1);
    if (!last) return true;

    return Boolean(last.handle?.root || ROOT_ROUTES.includes(last.pathname));
  }, [matches]);

  useEffect(() => {
    isRoot ? backButton.hide() : backButton.show();
  }, [isRoot]);

  return null;
};
