"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function useTime(interval = 1000): DateTime | undefined {
  const [now, setNow] = useState<DateTime>();

  useEffect(() => {
    setNow(DateTime.now);

    const i = setInterval(() => setNow(DateTime.now), interval);
    return () => clearInterval(i);
  }, [interval]);

  return now;
}
