import { User } from '@/shared/api';
import { useLocalStorage } from '@/shared/lib/hooks';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ContextValue = [
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>>,
];

export const VIEWER_STORED_KEY = 'viewer';

export const ViewerContext = createContext<ContextValue>(null!);

export const ViewerProvider = (props: PropsWithChildren) => {
  const [viewer, setViewer] = useState<User | null>(null);
  const [, setStoredViewer] = useLocalStorage<User | null>(
    VIEWER_STORED_KEY,
    null,
  );

  useEffect(() => {
    setStoredViewer(viewer);
  }, [viewer]);

  const value = useMemo<ContextValue>(
    () => [viewer, setViewer],
    [viewer, setViewer],
  );

  return (
    <ViewerContext.Provider value={value}>
      {props.children}
    </ViewerContext.Provider>
  );
};
