import Link from "next/link";
import React, { FunctionComponent } from "react";
import styles from "./Nav.module.scss";

interface ItemProps {
  href: string;
}

const Item: FunctionComponent<ItemProps> = ({ href, children }) => (
  <li className={styles.item}>
    <Link href={href}>
      <a>{children}</a>
    </Link>
  </li>
);

const Nav: FunctionComponent = () => (
  <nav className={styles.nav}>
    <Link href="/">
      <a className={styles.logo}>Skolorna</a>
    </Link>
    <ul>
      <Item href="/menus">Menyer</Item>
    </ul>
  </nav>
);

export default Nav;
