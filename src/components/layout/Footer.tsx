import Link from "next/link";
import React, { FunctionComponent } from "react";
import { GitHub, Instagram } from "react-feather";
import Logo from "../brand/Logo";
import Container from "./Container";
import styles from "./Footer.module.scss";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinkColumn {
  links: FooterLink[];
  heading: string;
}

type FooterLinks = FooterLinkColumn[];

const footerLinks: FooterLinks = [
  {
    heading: "Resurser",
    links: [
      {
        href: "/menus",
        label: "Menyer",
      },
      {
        href: "/blog",
        label: "Blogg",
      },
    ],
  },
  {
    heading: "Företaget",
    links: [
      {
        href: "/om",
        label: "Om oss",
      },
      {
        href: "/kontakt",
        label: "Kontakta oss",
      },
    ],
  },
];

const Footer: FunctionComponent = () => (
  <footer className={styles.footer}>
    <Container>
      <section className={styles.logo}>
        <Logo />

        <div className={styles.social}>
          <a href="https://www.instagram.com/skolornapunktcom/">
            <Instagram />
          </a>
          <a href="https://github.com/skolorna/">
            <GitHub />
          </a>
        </div>
      </section>
      <section className={styles.links}>
        {footerLinks.map((section) => (
          <div key={section.heading} className={styles.column}>
            <h3>{section.heading}</h3>
            <ul>
              {section.links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>
                    <a>{label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Container>
  </footer>
);

export default Footer;
