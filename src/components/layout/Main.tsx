import React, { FunctionComponent } from "react";
import styles from "./Main.module.scss";
import { Navbar } from "./Navbar";

const Main: FunctionComponent = ({ children }) => (
  <div>
    <Navbar />
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  </div>
);

export default Main;
