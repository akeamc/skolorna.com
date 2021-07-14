import React, { FunctionComponent } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import styles from "./Main.module.scss";

const Main: FunctionComponent = ({ children }) => (
  <div className={styles.container}>
    <Nav />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default Main;
