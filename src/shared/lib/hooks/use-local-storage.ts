import { useCallback, useState } from 'react';

export const getLocalStorageKey = (key: string) =>
  `${import.meta.env.APP_LOCAL_STORAGE_KEY}/${key}`;

export const getLocalStorageValue = <T>(key: string, initialValue: T): T => {
  try {
    const item = localStorage.getItem(getLocalStorageKey(key));

    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

export const setLocalStorageValue = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(getLocalStorageKey(key), JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getLocalStorageValue(key, initialValue),
  );

  const setValue = useCallback(
    (next: T | ((value: T) => T)) => {
      setStoredValue((currentValue) => {
        const updatedValue =
          typeof next === 'function'
            ? (next as (value: T) => T)(currentValue)
            : next;

        setLocalStorageValue(key, updatedValue);

        return updatedValue;
      });
    },

    [key],
  );

  return [storedValue, setValue] as const;
};
