import { useSchedule } from "@/lib/schedule/context";
import { useWeek } from "@/lib/schedule/hooks";

export default function Annotations() {
  const { cursor } = useSchedule();
  const { data } = useWeek(cursor);

  return (
    <div className="my-4 text-sm text-gray-500">
      <ul className="space-y-2">
        {data?.annotations.map((annotation, i) => (
          <li key={i}>{annotation}</li>
        ))}
      </ul>
    </div>
  );
}
