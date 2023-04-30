"use client";

import { DateTime } from "luxon";
import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type View = "month" | "week" | "day";

interface ScheduleContextType {
  view: View;
  setView: (view: View) => void;
  cursor: DateTime;
  setCursor: Dispatch<SetStateAction<DateTime>>;
  /**
   * The time bounds of every day (in seconds since midnight).
   */
  timeBounds: [number, number];
  daysPerWeek: number;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const ScheduleProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(DateTime.local());

  return (
    <ScheduleContext.Provider
      value={{
        view,
        setView,
        cursor,
        setCursor,
        timeBounds: [7 * 3600, 20 * 3600],
        daysPerWeek: 7,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx)
    throw new Error("useSchedule must be used within a ScheduleProvider");
  return ctx;
}
