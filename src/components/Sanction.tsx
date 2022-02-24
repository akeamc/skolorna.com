import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import createPersistedState from "use-persisted-state";
import styles from "./Sanction.module.scss";

const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    pointerEvents: "none",
  },
  visible: {
    opacity: 1,
    pointerEvents: "initial",
  },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    transition: {
      ease: "easeIn",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
    },
  },
};

const useSussyStatus = createPersistedState("not-sus");

export const Sanction = () => {
  const sus = !(typeof window !== "undefined"
    ? window.localStorage.getItem("not-sus")
    : null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(sus);
  }, [sus]);

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate={visible ? "visible" : undefined}
      className={styles.overlay}
    >
      <motion.div
        variants={modalVariants}
        className={styles.modal}
        transition={{ duration: 0.5 }}
      >
        <h2>Привет. Heter du Vladimir Putin?</h2>
        <p>
          Skolorna fördömer å det starkaste Rysslands invasion av Ukraina. Vi
          har infört effektiva sanktioner mot president Vladimir Putin.
        </p>
        <p>Är du President Putin?</p>
        <div className={styles.actions}>
          <button
            onClick={() => (window.location.href = "https://cnn.com")}
            title="Ja, jag heter Vladimir Putin."
          >
            Да
          </button>
          <button
            onClick={() => {
              localStorage.setItem("not-sus", "not putin");
              setVisible(false);
            }}
            title="Nej, jag heter inte Vladimir Putin"
          >
            Нет
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
