import { User } from '@/shared/api';
import { getLocalStorageValue, setLocalStorageValue } from '@/shared/lib/hooks';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useSyncExternalStore,
} from 'react';

export type ContextValue = [
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>>,
];

export const VIEWER_STORED_KEY = 'viewer';

export const ViewerContext = createContext<ContextValue>(null!);

let viewerState = getLocalStorageValue<User | null>(VIEWER_STORED_KEY, null);
const viewerListeners = new Set<() => void>();

const notifyViewerListeners = () =>
  viewerListeners.forEach((listener) => listener());

export const getViewerState = () => viewerState;

export const setViewer = (next: SetStateAction<User | null>) => {
  viewerState =
    typeof next === 'function'
      ? (next as (current: User | null) => User | null)(viewerState)
      : next;
  setLocalStorageValue(VIEWER_STORED_KEY, viewerState);
  notifyViewerListeners();
};

const subscribeToViewer = (listener: () => void) => {
  viewerListeners.add(listener);
  return () => viewerListeners.delete(listener);
};

export const ViewerProvider = (props: PropsWithChildren) => {
  const viewer = useSyncExternalStore(
    subscribeToViewer,
    getViewerState,
    () => null,
  );

  const value = useMemo<ContextValue>(() => [viewer, setViewer], [viewer]);

  return (
    <ViewerContext.Provider value={value}>
      {props.children}
    </ViewerContext.Provider>
  );
};
