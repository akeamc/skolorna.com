import React, { FunctionComponent } from "react";
import Container from "../layout/Container";
import Hero from "../layout/Hero";
import styles from "./HomeHero.module.scss";

const HomeHero: FunctionComponent = () => (
  <Hero>
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.text}>
          <h1>Elever i alla skolor, förena er!</h1>
          <p>Vi vet vad det blir till lunch.</p>
        </div>
      </div>
    </Container>
  </Hero>
);

export default HomeHero;
