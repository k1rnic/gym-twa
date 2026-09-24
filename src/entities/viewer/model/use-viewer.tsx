import { useContext } from 'react';
import { ViewerContext } from '../lib/viewer-provider';

export const useViewerContext = () => useContext(ViewerContext);
export const useViewer = () => useViewerContext()[0]!;
export const useSetViewer = () => useViewerContext()[1];
