import { motion } from "framer-motion";
import { DateTime } from "luxon";
import React, { FunctionComponent, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useDays } from "../../lib/oden/menus";
import { monthSpan } from "../../lib/utils/human-date";
import { Spinner } from "../Spinner";
import styles from "./DayBrowser.module.scss";

export interface Props {
  menu?: string;
}

export const DayBrowser: FunctionComponent<Props> = ({ menu }) => {
  const [cursor, setCursor] = useState(() => DateTime.now());
  const first = cursor.startOf("week");
  const last = cursor.endOf("week");

  const { data, isValidating } = useDays({
    menu,
    first,
    last,
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          onClick={() => setCursor(cursor.minus({ weeks: 1 }))}
          type="button"
          title="Föregående vecka"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => setCursor(cursor.plus({ weeks: 1 }))}
          type="button"
          title="Nästa vecka"
        >
          <ChevronRight />
        </button>
        <div className={styles.cursor}>
          <h2 className={styles.month}>{monthSpan(first, last)}</h2>
          <span className={styles.week}>
            <span className="short">V.</span>
            <span className="long">Vecka</span> {cursor.weekNumber}
            <style jsx>{`
              .long {
                display: none;
              }

              @media (min-width: 480px) {
                .long {
                  display: inline;
                }

                .short {
                  display: none;
                }
              }
            `}</style>
          </span>
        </div>
        {isValidating && <Spinner className={styles.spinner} />}
      </div>
      <ol>
        {data?.map(({ meals, date }) => (
          <li key={date} className={styles.day}>
            <ul className={styles.meals}>
              {meals.map(({ value }) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
            <h3 className={styles.date}>
              {DateTime.fromISO(date).toLocaleString(
                DateTime.DATE_MED_WITH_WEEKDAY
              )}
            </h3>
          </li>
        ))}
      </ol>
      {data?.length === 0 && (
        <motion.div
          className={styles.empty}
          style={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Vi vet inte vad det {last > DateTime.now() ? "blir" : "blev"} till
          lunch.
        </motion.div>
      )}
    </div>
  );
};
