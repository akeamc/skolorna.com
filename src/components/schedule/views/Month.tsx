import { Lesson } from "@/lib/schedule/client";
import { useSchedule } from "@/lib/schedule/context";
import { useDays } from "@/lib/schedule/hooks";
import classNames from "classnames";
import { DateTime } from "luxon";
import { FunctionComponent } from "react";

const Miniature: FunctionComponent<{ lessons: Lesson[] }> = ({ lessons }) => {
  const {
    timeBounds: [min, max],
  } = useSchedule();
  const len = max - min;
  const blocks = lessons.map((lesson) => {
    const [start, end] = lesson.seconds();
    return {
      id: lesson.id,
      offset: (start - min) / len,
      size: (end - start) / len,
      color: lesson.accent(),
    };
  });

  return (
    <div className="relative grow overflow-hidden">
      {blocks.map(({ id, offset, size, color }) => (
        <div
          key={id}
          className="absolute bottom-0 top-0 rounded-sm shadow-sm"
          style={{
            left: `${offset * 100}%`,
            width: `${size * 100}%`,
            backgroundColor: color.hex(),
          }}
        />
      ))}
    </div>
  );
};

const Week: FunctionComponent<{ cursor: DateTime; activeMonth: number }> = ({
  cursor,
  activeMonth,
}) => {
  const today = DateTime.local();
  const { setCursor, setView, daysPerWeek } = useSchedule();
  cursor = cursor.startOf("week");
  const { days, status } = useDays(cursor, daysPerWeek);

  function focusDay(day: DateTime) {
    setCursor(day);
    setView("day");
  }

  return (
    <>
      <span
        className="flex flex-col px-1 py-2.5 text-right text-xs"
        style={{ gridColumn: 1 }}
      >
        {cursor.weekNumber}
      </span>
      {days?.map(({ date, lessons }) => (
        <button
          key={date.day}
          className={classNames(
            "flex h-24 flex-col gap-1 px-2 py-1.5 hover:bg-gray-100",
            date.month === activeMonth ? "bg-white" : "bg-gray-50"
          )}
          style={{ gridColumn: date.weekday + 1 }}
          onClick={() => focusDay(date)}
        >
          <time
            className={classNames(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs transition",
              date.hasSame(today, "day")
                ? "bg-blue-700 font-medium text-white"
                : date.month === activeMonth
                ? "text-gray-900"
                : "text-gray-400",
              { blur: status === "pending" }
            )}
          >
            {date.day}
          </time>
          <Miniature lessons={lessons} />
        </button>
      ))}
    </>
  );
};

export default function MonthView() {
  const { cursor, daysPerWeek } = useSchedule();
  const weekdays = Array.from({ length: daysPerWeek }, (_, days) =>
    cursor
      .startOf("week")
      .plus({ days })
      .toLocaleString({ weekday: "short" }, { locale: "sv" })
  );

  return (
    <div
      className="grid gap-px overflow-hidden rounded-lg border bg-gray-200"
      style={{
        gridTemplateColumns: `1.5rem repeat(${daysPerWeek}, 1fr)`,
      }}
    >
      {weekdays.map((day, i) => (
        <div
          key={day}
          className="bg-white p-2 text-center text-xs font-medium text-gray-700"
          style={{ gridColumn: i + 2 }}
        >
          {day}
        </div>
      ))}
      {Array.from({ length: 6 }, (_, weeks) =>
        cursor.startOf("month").plus({ weeks })
      ).map((c) => (
        <Week key={+c} cursor={c} activeMonth={cursor.month} />
      ))}
    </div>
  );
}
