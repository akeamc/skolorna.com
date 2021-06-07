import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { Menu } from "../../types";

export interface PageProps {
  menus: Menu[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const res = await fetch("http://localhost:8000/menus");
  const menus: Menu[] = await res.json();

  return {
    props: {
      menus,
    },
  };
};

const MenusPage: NextPage<PageProps> = ({ menus }) => {
  return (
    <ul>
      {menus.map((menu) => (
        <li>
          <Link href={`/menus/${menu.id}`} prefetch={false}>
            <a>{menu.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenusPage;
