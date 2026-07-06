import 'react-router';

declare module 'react-router' {
  // Enforces this shape on ALL handles app-wide
  export interface RouteHandle {
    root?: boolean;
  }

  // Override the native matches structure
  export function useMatches(): Array<{
    id: string;
    pathname: string;
    params: Record<string, string | undefined>;
    data: unknown;
    handle: RouteHandle;
  }>;
}
