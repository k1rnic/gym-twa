import { ViewerProvider } from '@/entities/viewer';
import { ComponentType } from 'react';

export const withViewer =
  <T,>(Component: ComponentType<T>) =>
  (hocProps: T) =>
    (
      <ViewerProvider>
        <Component {...(hocProps as T & JSX.IntrinsicAttributes)} />
      </ViewerProvider>
    );
