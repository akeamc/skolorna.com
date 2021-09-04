import React, { FunctionComponent, ReactNode } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import styles from "./Main.module.scss";
import Seo, { SeoProps } from "../Seo";

export interface MainProps extends SeoProps {
  before?: ReactNode;
}

const Main: FunctionComponent<MainProps> = ({
  children,
  before,
  ...seoProps
}) => (
  <div className={styles.container}>
    {before}
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Seo {...seoProps} />
    <Nav />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default Main;
