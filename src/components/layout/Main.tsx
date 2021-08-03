import React, { FunctionComponent } from "react";
import Head from "next/head";
import Footer from "./Footer";
import Nav from "./Nav";
import styles from "./Main.module.scss";

export interface MainProps {
  title?: string;
}

const Main: FunctionComponent<MainProps> = ({
  title = "Skolorna",
  children,
}) => (
  <div className={styles.container}>
    <Head>
      <title>{title}</title>
    </Head>
    <Nav />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default Main;
