"use client";

import useLocalStorage from "./useLocalStorage";

export default function useHistory() {
  const [value, setValue] = useLocalStorage<Record<string, number>>(
    "recent-menus",
    {}
  );

  const record = (id: string, date = new Date()) => {
    setValue({
      ...value,
      [id]: date.getTime(),
    });
  };

  return {
    value,
    record,
  };
}
