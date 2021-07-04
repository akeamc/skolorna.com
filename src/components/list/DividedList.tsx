import classNames from "classnames/bind";
import React, {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
} from "react";
import styles from "./DividedList.module.scss";

export type DividedListProps = DetailedHTMLProps<
  HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

const DividedList: FunctionComponent<DividedListProps> = ({
  className,
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ul className={classNames(styles.list, className)} {...props} />
);

export default DividedList;
