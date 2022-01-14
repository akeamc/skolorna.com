import classNames from "classnames/bind";
import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { AlertCircle, Clock } from "react-feather";
import { relativelyRelativeTimestamp } from "../../lib/utils/human-date";
import styles from "./UpdatedAt.module.scss";

const cx = classNames.bind(styles);

export interface Props {
  updatedAt?: DateTime | null;
}

/**
 * Display when the data was last updated.
 */
export const UpdatedAt: FunctionComponent<Props> = ({ updatedAt }) => {
  const skeleton = typeof updatedAt === "undefined";
  const never = updatedAt === null;

  return (
    <span className={cx("updatedAt", { never, skeleton })}>
      {!skeleton && (
        <>
          {never ? <AlertCircle /> : <Clock />}
          <span>
            {never ? (
              "Aldrig uppdaterad"
            ) : (
              <time
                dateTime={updatedAt?.toISO()}
                title={updatedAt
                  ?.setLocale("sv")
                  .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
              >
                Uppdaterades {relativelyRelativeTimestamp(updatedAt)}
              </time>
            )}
          </span>
        </>
      )}
    </span>
  );
};
