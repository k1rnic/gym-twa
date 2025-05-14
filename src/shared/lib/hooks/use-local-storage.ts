import { useCallback, useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storedKey = `${import.meta.env.APP_LOCAL_STORAGE_KEY}/${key}`;

  const getValue = (): T => {
    try {
      const item = window.localStorage.getItem(storedKey);

      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getValue);

  const setValue = useCallback(
    (next: T | ((val: T) => T)) => {
      try {
        const updates = next instanceof Function ? next(storedValue) : next;

        window.localStorage.setItem(storedKey, JSON.stringify(updates));
        setStoredValue(updates);
      } catch (e) {
        console.log(e);
      }
    },
    [storedKey, storedValue],
  );

  return [storedValue, setValue] as const;
};
