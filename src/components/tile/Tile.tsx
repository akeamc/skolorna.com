import { ReactNode } from "markdown-to-jsx/node_modules/@types/react";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import styles from "./Tile.module.scss";

export interface TileProps {
  heading: ReactNode;
  subHeading?: ReactNode;
  href?: string;
}

const Tile: FunctionComponent<TileProps> = ({
  heading,
  subHeading,
  children,
  href,
}) => {
  const inner = (
    <a className={styles.tile}>
      {subHeading && <div className={styles.subheading}>{subHeading}</div>}
      <h2 className={styles.heading}>{heading}</h2>
      <div>{children}</div>
    </a>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
};

export default Tile;
