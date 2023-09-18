"use client";

import { DateTime } from "luxon";
import { FunctionComponent, ReactNode, createContext, useContext } from "react";
import { View } from ".";
import { useRouter, useSearchParams } from "next/navigation";

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
  klass: string | null;
  setClass: (klass: string | null) => void;
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
  const searchParams = useSearchParams()!;
  const klass = searchParams.get("class");

  function pushState(
    view: View,
    cursor: DateTime,
    klass: string | null = null
  ) {
    const params = new URLSearchParams(searchParams as any);
    if (klass) {
      params.set("class", klass);
    } else {
      params.delete("class");
    }

    router.push(
      `/schema/${view}/${cursor.year}/${cursor.month}/${
        cursor.day
      }?${params.toString()}`
    );
  }

  return (
    <ScheduleContext.Provider
      value={{
        view,
        setView: (view) => pushState(view, cursor, klass),
        cursor,
        setCursor: (cursor) => pushState(view, cursor, klass),
        pushState,
        timeBounds: [7 * 3600, 20 * 3600],
        daysPerWeek: 5,
        klass,
        setClass: (klass) => pushState(view, cursor, klass),
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
