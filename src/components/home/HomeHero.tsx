import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import { MenuStats } from "../../lib/oden/stats";
import Container from "../layout/Container";
import styles from "./HomeHero.module.scss";

export const HomeHero: FunctionComponent<{ stats: MenuStats }> = ({
  stats,
}) => {
  const { locale } = useRouter();

  return (
    <Container>
      <div className={styles.hero}>
        <h1>
          Vi vet vad det blir till lunch på{" "}
          <em>{stats.menus.toLocaleString(locale)}</em> ställen
        </h1>
        <p>
          Hittills har vi arkiverat {stats.days.toLocaleString(locale)}{" "}
          måltider.
        </p>
      </div>
    </Container>
  );
};
