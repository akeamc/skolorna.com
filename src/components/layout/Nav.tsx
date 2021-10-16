import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useAuth } from "../../lib/auth/context";
import Avatar from "../auth/Avatar";
import Logo from "../brand/Logo";
import Button from "../button/Button";
import Container from "./Container";
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

const Nav: FunctionComponent = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.nav}>
      <Container>
        <div className={styles.wrapper}>
          <Link href="/">
            <a className={styles.logo}>
              <Logo />
            </a>
          </Link>
          <ul className={styles.links}>
            <Item href="/menyer">Menyer</Item>
            <Item href="/blogg">Blogg</Item>
          </ul>
          <div className={styles.auth}>
            {user ? (
              <Avatar clickable />
            ) : (
              <>
                <Button href="/inloggning" variant="secondary">
                  Logga in
                </Button>
                <Button href="/registrering">Skapa konto</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Nav;
