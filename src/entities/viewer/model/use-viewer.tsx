import { User } from '@/shared/api';
import { getLocalStorageValue } from '@/shared/lib/hooks';
import { useContext } from 'react';
import { VIEWER_STORED_KEY, ViewerContext } from '../lib/viewer-provider';

export const useViewerContext = () => useContext(ViewerContext);
export const useViewer = () => useViewerContext()[0]!;
export const useSetViewer = () => useViewerContext()[1];

export const getViewerState = () =>
  getLocalStorageValue<User | null>(VIEWER_STORED_KEY, null);
