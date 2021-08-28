import classNames from "classnames";
import React, {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
} from "react";
import styles from "./Spinner.module.scss";

export type SpinnerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Spinner: FunctionComponent<SpinnerProps> = ({ className, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...props} className={classNames(styles.spinner, className)} />
);

export default Spinner;
