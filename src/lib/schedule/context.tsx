"use client";

import { DateTime } from "luxon";
import { FunctionComponent, ReactNode, createContext, useContext } from "react";
import { View } from ".";
import { useRouter } from "next/navigation";

interface ScheduleContextType {
  view: View;
  setView: (view: View) => void;
  cursor: DateTime;
  setCursor: (cursor: DateTime) => void;
  pushState: (view: View, cursor: DateTime) => void;
  /**
   * The time bounds of every day (in seconds since midnight).
   */
  timeBounds: [number, number];
  daysPerWeek: number;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const ScheduleProvider: FunctionComponent<{
  children: ReactNode;
  view: View;
  cursor: string;
}> = ({ children, view, cursor: isoCursor }) => {
  const cursor = DateTime.fromISO(isoCursor);
  const router = useRouter();

  function pushState(view: View, cursor: DateTime) {
    router.push(`/schema/${view}/${cursor.year}/${cursor.month}/${cursor.day}`);
  }

  return (
    <ScheduleContext.Provider
      value={{
        view,
        setView: (view) => pushState(view, cursor),
        cursor,
        setCursor: (cursor) => pushState(view, cursor),
        pushState,
        timeBounds: [7 * 3600, 20 * 3600],
        daysPerWeek: 5,
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
