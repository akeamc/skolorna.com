import classNames from "classnames/bind";
import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { AlertCircle, Clock } from "react-feather";
import styles from "./UpdatedAt.module.scss";

const cx = classNames.bind(styles);

export interface Props {
  updatedAt?: DateTime | null;
}

/**
 * Display when the data was last updated.
 */
export const UpdatedAt: FunctionComponent<Props> = ({ updatedAt }) => {
  const loading = typeof updatedAt === "undefined";
  const never = updatedAt === null;

  return (
    <span className={cx("updatedAt", { never })}>
      {never ? <AlertCircle /> : <Clock />}
      <span>
        {never ? (
          "Aldrig uppdaterad"
        ) : (
          <time
            dateTime={updatedAt?.toISO()}
            title={updatedAt?.toLocaleString(DateTime.DATETIME_FULL)}
          >
            {updatedAt?.toRelative({ locale: "sv", style: "short" })}
          </time>
        )}
      </span>
    </span>
  );
};
