"use client";

import { LOCALSTORAGE_KEY, getData } from "@/lib/oden/history";
import { FunctionComponent, useEffect } from "react";

const HistoryRecorder: FunctionComponent<{ menu: string }> = ({ menu }) => {
  useEffect(() => {
    const history = getData();
    history[menu] = Date.now();
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(history));
  }, [menu]);

  return null;
};

export default HistoryRecorder;
