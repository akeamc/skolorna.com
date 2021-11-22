import React, { FunctionComponent } from "react";
import styles from "./Main.module.scss";

const Main: FunctionComponent = ({ children }) => (
  <div className={styles.container}>
    <main className={styles.main}>{children}</main>
  </div>
);

export default Main;
