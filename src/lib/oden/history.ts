import { useEffect, useState } from "react";

export const LOCALSTORAGE_KEY = "menu-history";

export function getData(): Record<string, number> {
  let s = localStorage.getItem(LOCALSTORAGE_KEY);
  if (s === "undefined") {
    s = "";
  }
  return JSON.parse(s || "{}");
}

export function useHistory() {
  const [data, setData] = useState<Record<string, number>>();

  // this is a hack
  useEffect(() => {
    setData(getData());

    const interval = setInterval(() => {
      setData(getData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return [];

  let ids = Object.entries(data);
  ids.sort((a, b) => b[1] - a[1]);
  return ids.map(([id]) => id);
}
