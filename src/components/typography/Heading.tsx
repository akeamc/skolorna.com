/* eslint-disable jsx-a11y/heading-has-content */
import classNames from "classnames/bind";
import React, {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
} from "react";
import styles from "./Heading.module.scss";

const cx = classNames.bind(styles);

export type HeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

type Heading = FunctionComponent<HeadingProps>;

export const StandardPageHeading: Heading = ({ className, ...props }) => (
  <h1 className={cx("standard", className)} {...props} />
);
