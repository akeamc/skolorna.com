import Head from "next/head";
import React, { FunctionComponent } from "react";
import styles from "./Main.module.scss";
import { Navbar } from "./Navbar";

export interface Props {
  title?: string;
  description?: string;
}

const Main: FunctionComponent<Props> = ({ title, description, children }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
    </Head>
    <Navbar />
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  </div>
);

export default Main;
