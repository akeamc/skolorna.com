import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

export const Sanction = () => {
  const sus = !(typeof window !== "undefined"
    ? window.localStorage.getItem("not-sus")
    : null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [putin, setPutin] = useState(false);

  useEffect(() => {
    if (modalRef.current) {
      if (visible) {
        disableBodyScroll(modalRef.current);
      } else {
        enableBodyScroll(modalRef.current);
      }
    }
  }, [visible]);

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
        ref={modalRef}
      >
        <section className={styles.main}>
          <div className={styles.body}>
            {putin ? (
              <>
                <h2>Sanktionerad!</h2>
                <div className={styles.actions}>
                  <button
                    onClick={() => {
                      setPutin(false);
                    }}
                  >
                    Försök igen
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>Привет. Heter du Vladimir Putin?</h2>
                <p>
                  Skolorna fördömer å det starkaste Rysslands invasion av
                  Ukraina. Vi har infört effektiva sanktioner mot president
                  Vladimir Putin.
                </p>
                <p>Är du president Putin?</p>
                <div className={styles.actions}>
                  <button
                    onClick={() => setPutin(true)}
                    title="Ja, jag heter Vladimir Putin."
                  >
                    Ja (Да)
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("not-sus", "not putin");
                      setVisible(false);
                    }}
                    title="Nej, jag heter inte Vladimir Putin"
                  >
                    Nej (Нет)
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
        <footer>
          Vi vet att denna låtsassanktion kan tolkas som ett hån mot modern
          diplomati. Det har aldrig varit vår avsikt.
        </footer>
      </motion.div>
    </motion.div>
  );
};
