"use client";

import { useSchedule } from "@/lib/schedule/context";
import { useClasses } from "@/lib/schedule/hooks";
import classNames from "classnames";

export default function ClassSelector() {
  const { data } = useClasses();
  const { setClass, klass } = useSchedule();

  return (
    <div className="flex flex-col">
      {data?.map(({ reference, name }) => (
        <button
          onClick={() => setClass(reference)}
          key={reference}
          className={classNames("", { "text-red-500": klass === reference })}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
