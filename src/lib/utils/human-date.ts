import { DateTime } from "luxon";

export function relativelyRelativeTimestamp(date: DateTime): string {
  const now = DateTime.local();
  const diff = now.startOf("day").diff(date.startOf("day"), "days").days;

  switch (diff) {
    case 0:
      return `i dag ${date.toFormat("hh:mm")}`;
    case 1:
      return `i går ${date.toFormat("hh:mm")}`;
    default:
      return date.toISODate();
  }
}

/**
 * Format spans naturally, with information about month(s) and year(s).
 *
 * ```
 * monthSpan(DateTime.fromISO("2020-12-01"), DateTime.fromISO("2021-01-01")); // Dec. 2020 – Jan. 2021
 * ```
 *
 * @param start
 * @param end
 * @returns
 */
export function monthSpan(start: DateTime, end: DateTime): string {
  if (start.year !== end.year) {
    return `${start.toLocaleString({
      month: "short",
      year: "numeric",
    })} – ${end.toLocaleString({ month: "short", year: "numeric" })}`;
  }

  if (start.month !== end.month) {
    return `${start.toLocaleString({ month: "short" })} – ${end.toLocaleString({
      month: "short",
      year: "numeric",
    })}`;
  }

  return start.toLocaleString({ month: "long", year: "numeric" });
}
