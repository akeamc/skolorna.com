import { ScheduleProvider } from "@/lib/schedule/context";
import Calendar from "../../../../components/schedule/Calendar";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { View, isView } from "@/lib/schedule";
import Footer from "@/components/schedule/Footer";
import AuthRedirecter from "@/components/auth/AuthRedirecter";
import { Metadata } from "next";
import ClassSelector from "@/components/schedule/ClassSelector";

// export const runtime = "edge";

export const metadata: Metadata = {
  title: "Schema",
};

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
    <div className="main">
      <AuthRedirecter />
      <ScheduleProvider view={view} cursor={cursor.toISODate() || ""}>
        <ClassSelector />
        <main>
          <Calendar />
        </main>
        <hr className="my-6 h-px border-0 bg-gray-200" />
        <Footer />
      </ScheduleProvider>
    </div>
  );
}
