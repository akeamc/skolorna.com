import React, { FunctionComponent } from "react";
import styles from "./GridHeading.module.scss";

const GridHeading: FunctionComponent = ({ children }) => (
  <h2 className={styles.heading}>{children}</h2>
);

export default GridHeading;
