"use client";

import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useHistory() {
  const [ids, setIds] = useLocalStorage<Record<string, number>>(
    "recent-menus",
    {}
  );

  const record = (id: string, date = new Date()) => {
    setIds((ids) => ({
      ...ids,
      [id]: date.getTime(),
    }));
  };

  let idsArray = ids ? Object.entries(ids) : [];
  idsArray.sort((a, b) => b[1] - a[1]);

  return {
    ids: idsArray.map(([id]) => id),
    record,
  };
}
