import React, { FunctionComponent } from "react";
import styles from "./Hero.module.scss";

const Hero: FunctionComponent = ({ children }) => (
  <header className={styles.hero}>{children}</header>
);

export default Hero;
