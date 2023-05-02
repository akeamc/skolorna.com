"use client";

import { useSchedule } from "@/lib/schedule/context";
import CalendarHeader from "./Header";
import { ComponentType } from "react";
import MonthView from "./views/Month";
import DayView from "./views/Day";
import WeekView from "./views/Week";
import { View } from "@/lib/schedule";

const BODIES: Record<View, ComponentType> = {
  month: MonthView,
  week: WeekView,
  day: DayView,
};

export default function Calendar() {
  const { view } = useSchedule();
  const Body = BODIES[view];

  return (
    <>
      <CalendarHeader />
      <Body />
    </>
  );
}
