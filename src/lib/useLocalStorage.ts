import { useState, useEffect } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | undefined>();

  useEffect(() => {
    const value = window.localStorage.getItem(key);

    if (value) {
      try {
        const parsed = JSON.parse(value) as T;
        setStoredValue(parsed);
      } catch (error) {
        console.log(error);
        setStoredValue(initialValue);
      }
    } else {
      setStoredValue(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storedValue) {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedValue]);

  return [storedValue, setStoredValue] as const;
}
