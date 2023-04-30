"use client";

import { Lesson as TLesson } from "@/lib/schedule/client";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import { DateTime } from "luxon";
import { Fragment, FunctionComponent, useState } from "react";
import { Clock, MapPin, User, X } from "react-feather";

const LessonDetails: FunctionComponent<{
  lesson: TLesson;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ lesson, open, setOpen }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        // initialFocus={closeButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-900 focus-visible:ring-blue-700"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Lesson: FunctionComponent<{ lesson: TLesson }> = ({ lesson }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <LessonDetails lesson={lesson} open={open} setOpen={setOpen} />
      <div className="mx-1 h-full">
        <button
          className={classNames(
            "flex h-full w-full gap-2 overflow-hidden break-all rounded-md bg-[var(--bg)] p-1 text-left hover:bg-[var(--bg-hover)]",
            lesson.duration() < 2700
              ? "items-center justify-between"
              : "flex-col"
          )}
          style={{
            color: lesson.foreground().hex(),
            ["--bg" as any]: lesson.background().hex(),
            ["--bg-hover" as any]: lesson.background().darken(0.2).hex(),
          }}
          onClick={() => setOpen(true)}
        >
          <time className="text-xs max-sm:hidden">
            {lesson.start.toLocaleString(DateTime.TIME_SIMPLE, {
              locale: "sv",
            })}
            –{lesson.end.toLocaleString(DateTime.TIME_SIMPLE, { locale: "sv" })}
          </time>
          <h3 className="text-xs font-medium">{lesson.course}</h3>
        </button>
      </div>
    </>
  );
};

export default Lesson;
