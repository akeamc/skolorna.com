import { ScheduleProvider } from "@/lib/schedule/context";
import Calendar from "../../../components/schedule/Calendar";

export default function Page() {
  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <ScheduleProvider>
        <Calendar />
      </ScheduleProvider>
    </main>
  );
}
