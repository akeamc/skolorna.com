import React, { FunctionComponent } from "react";
import Container from "../layout/Container";
import styles from "./HomeHero.module.scss";

export interface HomeHeroProps {
  doodle: string;
}

const HomeHero: FunctionComponent<HomeHeroProps> = ({ doodle }) => (
  <header className={styles.header}>
    <div className={styles.bg}>{doodle}</div>
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <h1>Elever i alla skolor, förena er!</h1>
          <p>Vi vet vad det blir till lunch.</p>
        </div>
      </div>
    </Container>
  </header>
);

export default HomeHero;
