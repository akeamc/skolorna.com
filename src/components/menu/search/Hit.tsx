import React, { FunctionComponent } from "react";
import { BasicDoc, Hit as HitType } from "react-instantsearch-core";
import { Highlight } from "react-instantsearch-dom";
import Link from "next/link";
import styles from "./Hit.module.scss";

export const Hit: FunctionComponent<{ hit: HitType<BasicDoc> }> = ({ hit }) => (
  <Link href={`/menyer/${hit.id}`} prefetch={false}>
    <a>
      <span className={styles.title}>
        <Highlight attribute="title" hit={hit} />
      </span>
    </a>
  </Link>
);
