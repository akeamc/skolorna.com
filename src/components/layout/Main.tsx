import Head from "next/head";
import React, { FunctionComponent } from "react";
import styles from "./Main.module.scss";
import { Navbar } from "./Navbar";

export interface Props {
  title?: string;
}

const Main: FunctionComponent<Props> = ({ title, children }) => (
  <div>
    <Head>
      <title>{title}</title>
    </Head>
    <Navbar />
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  </div>
);

export default Main;
