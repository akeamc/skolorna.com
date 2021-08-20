import React, { FunctionComponent } from "react";
import Head from "next/head";
import Footer from "./Footer";
import Nav from "./Nav";
import styles from "./Main.module.scss";

export interface MainProps {
  title?: string;
  description?: string;
}

const Main: FunctionComponent<MainProps> = ({
  title = "Skolorna",
  description,
  children,
}) => (
  <div className={styles.container}>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
    <Nav />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default Main;
