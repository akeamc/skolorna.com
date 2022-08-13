import React, { FunctionComponent } from "react";
import Container from "./Container";
import styles from "./Navbar.module.scss";
import Search from "../menu/Search";
import { LogoIcon } from "../brand/Icon";
import Link from "next/link";

interface Item {
  label: string;
  href: string;
}

const items: Item[] = [
  {
    label: "Menyer",
    href: "/menyer",
  },
  {
    label: "Blogg",
    href: "/blogg",
  },
];

export const Navbar: FunctionComponent = () => {
  return (
    <Container>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logo}>
            <LogoIcon />
          </a>
        </Link>
        <Search />
        <nav className={styles.nav}>
          <ul>
            {items.map(({ label, href }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  );
};
