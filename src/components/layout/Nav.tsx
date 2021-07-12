import Link from "next/link";
import React, { FunctionComponent } from "react";
import styles from "./Nav.module.scss";

interface ItemProps {
	href: string;
}

const Item: FunctionComponent<ItemProps> = ({
	href,
	children,
}) => (
	<li className={styles.item}>
		<Link href={href}>
			{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			<a>{children}</a>
		</Link>
	</li>
)

const Nav: FunctionComponent = () => (
	<nav className={styles.nav}>
		<ul>
			<Item href="/menus">Menyer</Item>
		</ul>
	</nav>
);

export default Nav;
