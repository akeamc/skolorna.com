import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/context";
import { Day, Schedule } from "./client";
import { DateTime } from "luxon";

export function useDays(around: DateTime, count: number) {
  const { accessToken } = useAuth();
  const q = {
    year: around.weekYear,
    week: around.weekNumber,
  };
  const { data: schedule, status } = useQuery({
    queryKey: ["skool", "schedule", q],
    queryFn: async () => {
      const res = await fetch(
        `https://api.skolorna.com/v0/skool/schedule?year=${q.year}&week=${q.week}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return Schedule.fromJSON(await res.json());
    },
    enabled: !!accessToken,
  });
  const start = around.startOf("week");

  const days: Day[] = Array.from({ length: count }).map((_, i) => ({
    date: start.plus({ days: i }),
    lessons: [],
  }));

  for (const lesson of schedule?.lessons ?? []) {
    const day = days.find((day) => day.date.hasSame(lesson.start, "day"));

    if (day) {
      day.lessons.push(lesson);
    } else {
      console.warn("missing day for lesson", lesson);
      days.push({ date: lesson.start, lessons: [lesson] });
    }
  }

  return { days, status };
}

export function useClasses() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["skool", "classes"],
    queryFn: async () => {
      const res = await fetch(`https://api.skolorna.com/v0/skool/classes`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      return await res.json();
    },
    enabled: !!accessToken,
  });
}

export function useCredentials() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["skool", "credentials"],
    queryFn: async () => {
      const res = await fetch(`https://api.skolorna.com/v0/skool/credentials`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      return await res.json();
    },
    enabled: !!accessToken,
  });
}
