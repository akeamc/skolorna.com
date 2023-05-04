"use client";

import { Lesson as TLesson } from "@/lib/schedule/client";
import { Dialog } from "@headlessui/react";
import useResizeObserver from "@react-hook/resize-observer";
import classNames from "classnames";
import { DateTime } from "luxon";
import {
  Fragment,
  FunctionComponent,
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Clock, MapPin, User } from "react-feather";
import Modal from "../Modal";

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
          <Dialog.Title className="flex flex-col" as="div">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {lesson.course}
            </h3>
            <time className="text-sm font-normal">
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
          </Dialog.Title>
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
