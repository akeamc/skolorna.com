"use client";

import useHistory from "@/lib/useHistory";
import { FunctionComponent, useEffect } from "react";

const HistoryRecorder: FunctionComponent<{ menu: string }> = ({ menu }) => {
  const { record } = useHistory();

  useEffect(() => {
    record(menu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  return null;
};

export default HistoryRecorder;
