import React, { FunctionComponent } from "react";
import Logo from "../brand/Logo";
import Container from "./Container";
import styles from "./Footer.module.scss";

const Footer: FunctionComponent = () => (
  <footer className={styles.footer}>
    <Container>
      <Logo />
    </Container>
  </footer>
);

export default Footer;
