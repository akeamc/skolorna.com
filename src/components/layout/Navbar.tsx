import React, { FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
  Variants,
} from "framer-motion";
import classNames from "classnames/bind";
import { Menu } from "react-feather";
import Container from "./Container";
import styles from "./Navbar.module.scss";
import { LogoIcon } from "../brand/Icon";
import useMediaQuery from "../../lib/utils/media-query";

const cx = classNames.bind(styles);

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
  {
    href: "/encyklopedi",
    label: "Encyklopedi",
    highlightSubpaths: true,
  },
];

const drawerVariants: Variants = {
  open: {
    opacity: 1,
    width: "auto",
    height: "auto",
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
  closed: {
    opacity: 0,
    width: "var(--button-size)",
    height: "var(--button-size)",
  },
};

const drawerItemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
  },
  closed: {
    opacity: 0,
    y: 10,
  },
};

const Drawer: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  return (
    <motion.div className={cx("drawerContainer", { open })}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/control-has-associated-label, jsx-a11y/interactive-supports-focus */}
      <div
        className={cx("overlay")}
        onClick={() => setOpen(false)}
        role="button"
        title="Stäng"
      />
      <button
        className={styles.toggle}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <Menu />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={styles.drawer}
          >
            {items.map(({ href, label }) => (
              <motion.li key={href} variants={drawerItemVariants}>
                <Link href={href}>
                  <a>{label}</a>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Navbar: FunctionComponent = () => {
  const router = useRouter();
  const [highlighted, setHighlighted] = useState(router.asPath);

  return (
    <nav className={styles.nav}>
      <Container>
        <ul className={styles.horizontal}>
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
                key={href}
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
                    style={{
                      borderRadius: 12, // Fix distortion by informing Framer about the border radius
                      opacity: 0,
                    }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </li>
            ))}
          </AnimateSharedLayout>
          <Drawer />
        </ul>
      </Container>
    </nav>
  );
};
