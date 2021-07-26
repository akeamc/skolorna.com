import React, { FunctionComponent } from "react";
import { DateTime } from "luxon";
import { useDays } from "../../lib/menu-proxy/days";
import DividedList from "../list/DividedList";
import InlineSkeleton from "../skeleton/InlineSkeleton";
import { Day } from "../../lib/menu-proxy/types";
import styles from "./DayListSection.module.scss";

interface DayListItemProps {
  day?: Day;
}

const DayListItem: FunctionComponent<DayListItemProps> = ({ day }) => {
  const date = day?.date ? DateTime.fromISO(day.date) : undefined;

  return (
    <li>
      <ul className={styles.meals}>
        {(day?.meals ?? new Array(2).fill(undefined)).map((meal, i) => (
          <li key={meal?.value ?? i}>
            {meal?.value ?? <InlineSkeleton width="48em" />}
          </li>
        ))}
      </ul>
      <h3 className={styles.date}>
        {date?.toLocaleString({
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }) ?? <InlineSkeleton width="10em" />}
      </h3>
    </li>
  );
};

export interface DayListSectionProps {
  menu?: string;
}

const DayListSection: FunctionComponent<DayListSectionProps> = ({ menu }) => {
  const { data } = useDays({ menu });

  if (data && data?.length === 0) {
    return (
      <section>
        <div className={styles.gone}>
          <code className={styles.ascii}>(╯°□°)╯︵ ┻━┻</code>
          <p>Ingen information hittades. Kanske är du ledig?</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <DividedList as="ol" className={styles.days}>
        {(data ?? new Array(12).fill(undefined)).map((day, i) => (
          <DayListItem day={day} key={day?.date ?? i} />
        ))}
      </DividedList>
    </section>
  );
};

export default DayListSection;
