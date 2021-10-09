import Link from "next/link";
import React, { FunctionComponent, ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./Tile.module.scss";

const cx = classNames.bind(styles);

export interface TileProps {
  heading: ReactNode;
  subHeading?: ReactNode;
  href?: string;
  danger?: boolean;
}

const Tile: FunctionComponent<TileProps> = ({
  heading,
  subHeading,
  children,
  href,
  danger,
}) => {
  const inner = (
    <a className={cx("tile", { "danger-tile": danger })}>
      {subHeading && <div className={styles.subheading}>{subHeading}</div>}
      <h3 className={styles.heading}>{heading}</h3>
      <div>{children}</div>
    </a>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
};

export default Tile;
