import { ScheduleProvider } from "@/lib/schedule/context";
import Calendar from "../../../../components/schedule/Calendar";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { View, isView } from "@/lib/schedule";

export const config = { runtime: "edge" };

function parseParams(params: string[]): {
  view: View | null;
  cursor: DateTime | null;
} {
  if (params.length === 0) {
    return {
      view: "week",
      cursor: DateTime.local(),
    };
  }

  let [view, year, month, day] = params;
  let cursor = null;
  try {
    cursor = DateTime.fromObject({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
    });
    if (!cursor.isValid) cursor = null;
  } catch (error) {}
  return { view: isView(view) ? view : null, cursor };
}

export default function Page({ params }: { params: { slug?: string[] } }) {
  const { view, cursor } = parseParams(params.slug || []);

  if (!view || !cursor) {
    redirect("/schema");
  }

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <ScheduleProvider view={view} cursor={cursor.toISODate() || ""}>
        <Calendar />
      </ScheduleProvider>
    </main>
  );
}
