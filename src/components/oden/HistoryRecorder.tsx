"use client";

import useHistory from "@/lib/useHistory";
import { FunctionComponent, useEffect } from "react";

const HistoryRecorder: FunctionComponent<{ menu: string }> = ({ menu }) => {
  const { record } = useHistory();

  useEffect(() => {
    record(menu);
  }, [menu, record]);

  return null;
};

export default HistoryRecorder;
