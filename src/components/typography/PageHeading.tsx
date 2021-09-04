/* eslint-disable jsx-a11y/heading-has-content */
import classNames from "classnames";
import React from "react";
import styles from "./PageHeading.module.scss";
import { Heading } from "./types";

const PageHeading: Heading = ({ className, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h1 {...rest} className={classNames(styles.heading, className)} />
);

export default PageHeading;
