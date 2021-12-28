import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { useDays } from "../../lib/oden/menus";
import styles from "./DayBrowser.module.scss";

export interface Props {
  menu?: string;
}

export const DayBrowser: FunctionComponent<Props> = ({ menu }) => {
  const { data } = useDays({ menu });

  return (
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
  );
};
