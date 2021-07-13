import React, { FunctionComponent } from "react";
import styles from "./Grid.module.scss";

const Grid: FunctionComponent = ({ children }) => (
  <div className={styles.grid}>{children}</div>
);

export default Grid;
