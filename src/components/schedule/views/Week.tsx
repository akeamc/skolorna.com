import Days from "@/components/schedule/Days";
import { useSchedule } from "@/lib/schedule/context";
import useDays from "@/lib/schedule/useDays";

export default function WeekView() {
  const { cursor, daysPerWeek } = useSchedule();
  const { days, status } = useDays(cursor, daysPerWeek);

  return <Days days={days} status={status} />;
}
