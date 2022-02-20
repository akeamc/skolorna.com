import Head from "next/head";
import React, { FunctionComponent } from "react";
import { Footer } from "./Footer";
import styles from "./Main.module.scss";
import { Navbar } from "./Navbar";

export interface Props {
  title?: string;
  description?: string;
}

const Main: FunctionComponent<Props> = ({
  title = "Skolorna",
  description = "Vi vet vad det blir till lunch.",
  children,
}) => (
  <>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Skolorna" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
    <Navbar />
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
    <Footer />
  </>
);

export default Main;
