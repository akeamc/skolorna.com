import classNames from "classnames/bind";
import React, {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
} from "react";
import styles from "./DividedList.module.scss";

type HTMLProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>;

type HTMLListProps = HTMLProps<HTMLUListElement> & HTMLProps<HTMLOListElement>;

export interface DividedListProps extends HTMLListProps {
  as?: "ul" | "ol";
}

/**
 * Set vertical padding for the list items with css variable `--list-y-gap`.
 */
const DividedList: FunctionComponent<DividedListProps> = ({
  className,
  as: List = "ul",
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <List className={classNames(styles.list, className)} {...props} />
);

export default DividedList;
