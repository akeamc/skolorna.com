import { Day } from "@/lib/schedule/client";
import { useSchedule } from "@/lib/schedule/context";
import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Lesson from "./Lesson";
import classNames from "classnames";
import { DateTime } from "luxon";
import { QueryStatus } from "@tanstack/react-query";

const Indicator: FunctionComponent<{
  days: Day[];
  min: number;
  max: number;
}> = ({ days, min, max }) => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    if (!indicatorRef.current) return;
    const now = DateTime.now();
    const day = days.findIndex((day) => day.date.hasSame(now, "day"));
    const progress =
      (now.hour * 3600 + now.minute * 60 + now.second - min) / (max - min);

    indicatorRef.current.style.top = `${progress * 100}%`;
    indicatorRef.current.style.left = `${(100 * day) / days.length}%`;

    const visible = day !== -1 && progress >= 0 && progress <= 1;

    indicatorRef.current.style.display = visible ? "block" : "none";
  }, [days, max, min]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [update]);

  return (
    <div
      ref={indicatorRef}
      className="absolute h-px bg-blue-700 transition-all before:absolute before:-left-1 before:top-1/2 before:block before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-blue-700 before:content-['']"
      style={{
        width: `${100 / days.length}%`,
        display: "none", // hidden before first update
      }}
    />
  );
};

const XScale: FunctionComponent<{
  days: Day[];
  header: boolean;
  status: QueryStatus;
}> = ({ days, header, status }) => (
  <>
    {header && (
      <div
        className="absolute -top-12 left-[-1px] right-0 grid h-12 gap-px border-x bg-gray-200"
        style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
      >
        {days.map(({ date }) => (
          <div
            key={date.toISODate()}
            className="flex flex-wrap items-center justify-center gap-x-1 bg-white pb-2"
          >
            <span className="text-sm leading-none text-gray-500">
              {date.toLocaleString({ weekday: "short" }, { locale: "sv" })}
            </span>
            <span
              className={classNames(
                "text-sm font-medium leading-none transition",
                date.hasSame(DateTime.now(), "day")
                  ? "flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white"
                  : "text-gray-900",
                { blur: status !== "success" }
              )}
            >
              {date.day}
            </span>
          </div>
        ))}
      </div>
    )}

    {Array.from({ length: days.length + 1 }).map((_, i) => (
      <hr
        key={i}
        className="absolute -top-4 border-r"
        style={{
          right: `${(i * 100) / days.length}%`,
          height: "calc(100% + 1rem)",
        }}
      />
    ))}
  </>
);

const YScale: FunctionComponent<{
  start: number;
  hours: number;
}> = ({ start, hours }) => (
  <>
    {Array.from({ length: hours }).map((_, i) => (
      <div
        key={i}
        className="absolute left-0 right-0 border-t"
        style={{
          top: `${(i / hours) * 100}%`,
        }}
      >
        <span className="absolute -left-10 w-8 -translate-y-1/2 text-right text-xs leading-none text-gray-400">
          {i + start / 3600}:00
        </span>
      </div>
    ))}
  </>
);

const Days: FunctionComponent<{
  days: Day[];
  status: QueryStatus;
  header?: boolean;
}> = ({ days, status, header = true }) => {
  const {
    timeBounds: [min, max],
  } = useSchedule();
  const hours = (max - min) / 3600;

  if (!Number.isInteger(hours)) throw new Error("`hours` must be an integer");

  return (
    <div className="flex w-full">
      <div
        className={classNames(
          "relative ml-10 flex w-full",
          header ? "mt-12" : "mt-4"
        )}
        style={{ height: `${hours * 4}rem` }}
      >
        <XScale days={days} header={header} status={status} />
        <YScale start={min} hours={hours} />
        <Indicator days={days} min={min} max={max} />
        <ol>
          {days.map(({ date, lessons }, i) => (
            <Fragment key={date.toISODate()}>
              {Array.from({ length: hours * 2 }).map((_, i) => (
                <div className="bg-white" key={i} style={{ gridRow: i + 2 }} />
              ))}
              {lessons.map((lesson) => {
                const [start, end] = lesson.seconds();
                const offset = (start - min) / (max - min);
                const size = (end - start) / (max - min);

                return (
                  <li
                    key={lesson.id}
                    className="absolute"
                    style={{
                      top: `${offset * 100}%`,
                      height: `${size * 100}%`,
                      left: `${(i * 100) / days.length}%`,
                      width: `calc(${100 / days.length}% - 1px)`,
                    }}
                  >
                    <Lesson lesson={lesson} />
                  </li>
                );
              })}
            </Fragment>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Days;
