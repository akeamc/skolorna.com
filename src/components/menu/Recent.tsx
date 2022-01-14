import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useMenuHistory } from "../../lib/menu/history";
import { useDays, useMenu } from "../../lib/oden/menus";
import { InlineSkeleton } from "../skeleton/InlineSkeleton";
import styles from "./Recent.module.scss";

interface ItemProps {
  id: string;
  mealLimit?: number;
}

const Item: FunctionComponent<ItemProps> = ({ id, mealLimit = 3 }) => {
  const { data: menu } = useMenu(id);
  const { data: days } = useDays({ menu: id });
  const nextDay = days?.[0];
  const meals = nextDay?.meals;
  const shown = meals?.slice(0, mealLimit);

  return (
    <li className={styles.item}>
      <Link href={`/menyer/${id}`} prefetch>
        <a>
          <h3>{menu?.title ?? <InlineSkeleton count={2} />}</h3>
          <div className={styles.meta}>
            {shown ? (
              <>
                <ul>
                  {shown.map((meal) => (
                    <li key={meal.value}>{meal.value}</li>
                  ))}
                </ul>
                {shown.length < meals!.length && (
                  <span className={styles.note}>
                    (+{meals!.length - shown.length})
                  </span>
                )}
              </>
            ) : (
              "Ingen information"
            )}
          </div>
        </a>
      </Link>
    </li>
  );
};

export interface Props {
  maxLength?: number;
}

export const Recent: FunctionComponent<Props> = ({ maxLength = 6 }) => {
  const history = useMenuHistory();

  return (
    <div className={styles.root}>
      <h2>Historik</h2>
      <div className={styles.wrapper}>
        <ol>
          {history.stack.slice(0, maxLength).map(({ key }) => (
            <Item key={key} id={key} />
          ))}
        </ol>
      </div>
    </div>
  );
};
