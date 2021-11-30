import React, { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimateSharedLayout, motion } from "framer-motion";
import Container from "./Container";
import styles from "./Navbar.module.scss";
import { LogoIcon } from "../brand/Icon";

interface Item {
  href: string;
  label: string;
  highlightSubpaths?: boolean;
}

const items: Item[] = [
  {
    href: "/",
    label: "Start",
  },
  {
    href: "/menyer",
    label: "Menyer",
    highlightSubpaths: true,
  },
  {
    href: "/blogg",
    label: "Blogg",
    highlightSubpaths: true,
  },
];

export const Navbar: FunctionComponent = () => {
  const router = useRouter();
  const [highlighted, setHighlighted] = useState(router.asPath);

  return (
    <nav className={styles.nav}>
      <Container>
        <ul>
          <Link href="/">
            <a className={styles.logo}>
              <LogoIcon />
            </a>
          </Link>
          <AnimateSharedLayout>
            {items.map(({ href, label, highlightSubpaths = false }) => (
              <li
                className={styles.item}
                onMouseEnter={() => setHighlighted(href)}
                onMouseLeave={() => setHighlighted(router.asPath)}
              >
                <Link href={href}>
                  <a>{label}</a>
                </Link>
                {(highlightSubpaths
                  ? highlighted.startsWith(href)
                  : highlighted === href) && (
                  <motion.div
                    className={styles.indicator}
                    layoutId="indicator"
                    style={{ borderRadius: 12 }} // Fix distortion by informing Framer about the border radius
                  />
                )}
              </li>
            ))}
          </AnimateSharedLayout>
        </ul>
      </Container>
    </nav>
  );
};
