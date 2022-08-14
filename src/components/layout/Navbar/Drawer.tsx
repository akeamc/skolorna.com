import classNames from "classnames/bind";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import { Menu } from "react-feather";
import useMediaQuery from "../../../lib/utils/media-query";
import styles from "./Drawer.module.scss";
import { items } from "./items";

const cx = classNames.bind(styles);

const variants: Variants = {
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

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
  },
  closed: {
    opacity: 0,
    y: 10,
  },
};

const overlayVariants: Variants = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
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
    <div className={cx("container", { open })}>
      <motion.div
        className={styles.overlay}
        onClick={() => setOpen(false)}
        role="button"
        title="Stäng"
        variants={overlayVariants}
        animate={open ? "open" : "closed"}
        initial="closed"
        transition={{ ease: "easeInOut" }}
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
          <motion.nav
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            className={styles.drawer}
          >
            <motion.ul>
              {items.map(({ href, label }) => (
                <motion.li key={href} variants={itemVariants}>
                  <Link href={href}>
                    <a>{label}</a>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Drawer;
