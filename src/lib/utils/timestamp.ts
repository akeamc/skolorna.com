import { DateTime } from "luxon";

export function humanTimestamp(date: DateTime): string {
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
