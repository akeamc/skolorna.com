import Days from "@/components/schedule/Days";
import { useSchedule } from "@/lib/schedule/context";
import useDays from "@/lib/schedule/useDays";

export default function DayView() {
  const { cursor, daysPerWeek } = useSchedule();
  const { days, status } = useDays(cursor, daysPerWeek);

  return (
    <Days
      days={days.filter(({ date }) => date.hasSame(cursor, "day"))}
      header={false}
      status={status}
    />
  );
}
