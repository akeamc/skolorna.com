import React, { FunctionComponent } from "react";
import styles from "./PageHeading.module.scss";

const PageHeading: FunctionComponent = ({ children }) => (
  <h1 className={styles.heading}>{children}</h1>
);

export default PageHeading;
