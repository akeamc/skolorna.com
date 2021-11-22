import React, { FunctionComponent } from "react";
import styles from "./Container.module.scss";

const Container: FunctionComponent = ({
  children,
}) => <div className={styles.container}>{children}</div>;

export default Container;
