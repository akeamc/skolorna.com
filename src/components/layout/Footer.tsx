import React, { FunctionComponent } from "react";
import { GitHub, Instagram } from "react-feather";
import styles from "./Footer.module.scss";
import Container from "./Container";

export const Footer: FunctionComponent = () => (
  <footer className={styles.footer}>
    <Container>
      <div className={styles.row}>
        <div className={styles.copyright}>Skolorna © 2021</div>
        <a href="https://www.instagram.com/skolornapunktcom/" title="Instagram">
          <Instagram />
        </a>
        <a href="https://github.com/skolorna/" title="GitHub">
          <GitHub />
        </a>
      </div>
    </Container>
  </footer>
);
