"use client";

import { Lesson as TLesson } from "@/lib/schedule/client";
import { Dialog, Transition } from "@headlessui/react";
import useResizeObserver from "@react-hook/resize-observer";
import classNames from "classnames";
import { DateTime, Duration, Interval } from "luxon";
import {
  FunctionComponent,
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MapPin, User } from "react-feather";
import Modal from "../Modal";
import useNow from "@/lib/useNow";

const Clock: FunctionComponent<{ className?: string; animated?: boolean }> = ({
  className,
  animated = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12">
      {animated && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="2s"
          repeatCount="indefinite"
        />
      )}
    </polyline>
    <polyline points="12 12 16 14">
      {animated && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="-26.55 12 12" // make the hands line up properly by offsetting the start
          to="333.45 12 12"
          dur="24s"
          repeatCount="indefinite"
        />
      )}
    </polyline>
    {/* <polyline points="12 6 12 12 16 14" /> */}
  </svg>
);

const Countdown: FunctionComponent<{ lesson: TLesson }> = ({ lesson }) => {
  const now = useNow();
  let remaining = now
    ? Interval.fromDateTimes(now, lesson.end).toDuration()
    : undefined;
  if (!remaining?.isValid) remaining = Duration.fromMillis(0);
  const live = now && now >= lesson.start && now < lesson.end;

  return (
    <Transition
      show={live}
      appear
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-1000"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 blur"
    >
      <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-orange-500">
        {remaining?.toFormat("hh:mm:ss")}
      </span>
    </Transition>
  );
};

const LessonDetails: FunctionComponent<{
  lesson: TLesson;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ lesson, open, setOpen }) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div
          className="mr-6 grid gap-x-2 gap-y-4"
          style={{ gridTemplateColumns: `fit-content(50%) 1fr` }}
        >
          <div
            className="m-auto h-3 w-3 rounded-sm"
            style={{ backgroundColor: lesson.accent().hex() }}
          />
          <div className="flex flex-col">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              {lesson.course}
            </Dialog.Title>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <time className="text-sm font-normal leading-6">
                {lesson.start.toLocaleString(
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  },
                  { locale: "sv" }
                )}{" "}
                &middot;{" "}
                {lesson.start.toLocaleString(DateTime.TIME_SIMPLE, {
                  locale: "sv",
                })}
                –
                {lesson.end.toLocaleString(DateTime.TIME_SIMPLE, {
                  locale: "sv",
                })}
              </time>
              <Countdown lesson={lesson} />
            </div>
          </div>
          <MapPin className="m-auto h-5 w-5 text-gray-500" />
          <span className="text-sm">{lesson.location || "–"}</span>
          <User className="m-auto h-5 w-5 text-gray-500" />
          <span className="text-sm">{lesson.teacher || "–"}</span>
          <Clock className="m-auto h-5 w-5 text-gray-500" />
          <span className="text-sm">
            {lesson.end.diff(lesson.start, "minutes").minutes} minuter
          </span>
        </div>
      </div>
    </Modal>
  );
};

function useVisibiliy(target: RefObject<HTMLElement>) {
  const [size, setSize] = useState<DOMRect>();
  const width = size?.width || 0;

  useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return {
    showEnd: width > 96,
    showLocation: width > 64,
  };
}

const Lesson: FunctionComponent<{ lesson: TLesson }> = ({ lesson }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const { showEnd, showLocation } = useVisibiliy(ref);

  return (
    <>
      <LessonDetails lesson={lesson} open={open} setOpen={setOpen} />
      <div className="mx-1 h-full">
        <button
          ref={ref}
          className={classNames(
            "flex h-full w-full overflow-hidden break-all rounded-md bg-[var(--bg)] p-1 text-left text-xs hover:bg-[var(--bg-hover)]",
            lesson.duration() < 2700
              ? "items-center justify-between"
              : "flex-col gap-2"
          )}
          style={{
            color: lesson.foreground().hex(),
            ["--bg" as any]: lesson.background().hex(),
            ["--bg-hover" as any]: lesson.background().darken(0.2).hex(),
          }}
          onClick={() => setOpen(true)}
        >
          <span>
            <time>
              {lesson.start.toLocaleString(DateTime.TIME_SIMPLE, {
                locale: "sv",
              })}
              {showEnd
                ? `–${lesson.end.toLocaleString(DateTime.TIME_SIMPLE, {
                    locale: "sv",
                  })}`
                : ""}
            </time>
            {showLocation && lesson.location ? ` · ${lesson.location}` : ""}
          </span>
          <h3 className="font-medium">{lesson.course}</h3>
        </button>
      </div>
    </>
  );
};

export default Lesson;
