import { ReactNode } from "markdown-to-jsx/node_modules/@types/react";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import styles from "./Tile.module.scss";

export interface TileProps {
  primaryTitle: ReactNode;
  secondaryTitle?: ReactNode;
  href: string;
}

const Tile: FunctionComponent<TileProps> = ({
  primaryTitle,
  secondaryTitle,
  children,
  href,
}) => (
  <Link href={href}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={styles.tile}>
      {secondaryTitle && <h3 className={styles.secondary}>{secondaryTitle}</h3>}
      <h2 className={styles.title}>{primaryTitle}</h2>
      <div>{children}</div>
    </a>
  </Link>
);

export default Tile;
