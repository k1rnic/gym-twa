import { User } from '@/shared/api';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

export type ContextValue = [
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>>,
];

export const ViewerContext = createContext<ContextValue>(null!);

export const ViewerProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<ContextValue>(() => [user, setUser], [user, setUser]);

  return (
    <ViewerContext.Provider value={value}>
      {props.children}
    </ViewerContext.Provider>
  );
};
