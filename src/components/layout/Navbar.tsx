import React, { FunctionComponent } from "react";
import Container from "./Container";
import styles from "./Navbar.module.scss";
import Search from "../menu/Search";

export const Navbar: FunctionComponent = () => {
  return (
    <nav className={styles.nav}>
      <Container>
        <div className={styles.horizontal}>
          <Search />
        </div>
      </Container>
    </nav>
  );
};
