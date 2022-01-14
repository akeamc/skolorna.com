import React, { FunctionComponent } from "react";
import Container from "../layout/Container";
import styles from "./HomeHero.module.scss";

export const HomeHero: FunctionComponent = () => (
  <Container>
    <div className={styles.text}>
      <h1 className={styles.heading}>
        Vi vet vad det blir till lunch<sup>*</sup>
      </h1>
      <p className={styles.description}>
        Med sofistikerade algoritmer analyserar vi skolmaten i över 7&nbsp;000
        skolor i hela Sverige.
      </p>
      <p className={styles.note}>
        <sup>*</sup>Förutom när vi inte vet.
      </p>
    </div>
  </Container>
);
