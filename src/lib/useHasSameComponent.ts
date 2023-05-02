"use client";

import { DateTime, DateTimeUnit } from "luxon";
import { useEffect, useState } from "react";

export default function useHasSameComponent(
  compare: DateTime,
  unit: DateTimeUnit,
  interval = 1000
): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const update = () => setValue(DateTime.now().hasSame(compare, unit));
    update();
    const i = setInterval(update, interval);
    return () => clearInterval(i);
  }, [compare, unit, interval]);

  return value;
}
