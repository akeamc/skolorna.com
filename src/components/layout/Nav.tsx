import Link from "next/link";
import React, { FunctionComponent } from "react";
import Logo from "../brand/Logo";
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
      <a className={styles.logo}>
        <Logo />
      </a>
    </Link>
    <ul>
      <Item href="/menyer">Menyer</Item>
    </ul>
  </nav>
);

export default Nav;
