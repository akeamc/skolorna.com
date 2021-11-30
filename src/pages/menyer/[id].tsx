import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import Main from "../../components/layout/Main";
import { getMenu, Menu } from "../../lib/oden/menus";
import { UpdatedAt } from "../../components/menu/UpdatedAt";
import Container from "../../components/layout/Container";
import { DayBrowser } from "../../components/menu/DayBrowser";
import { InlineSkeleton } from "../../components/skeleton/InlineSkeleton";
import styles from "./[id].module.scss";

export interface PageProps {
  menu: Menu | null;
}

export interface Q extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<PageProps, Q> = async ({
  params,
}) => {
  const id = params?.id;

  if (typeof id !== "string") {
    throw new Error("?id must be a string");
  }

  try {
    const menu = await getMenu(id);

    return {
      props: {
        menu,
      },
      revalidate: menu ? 86400 : 300, // menu is null if it doesn't exist
    };
  } catch (error) {
    return {
      props: {
        menu: null,
      },
      revalidate: 60,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

const MenuPage: NextPage<PageProps> = ({ menu }) => {
  const { isFallback } = useRouter();

  if (!isFallback && !menu) {
    return <p>404</p>;
  }

  return (
    <Main>
      <Container>
        <h1 className={styles.heading}>
          {menu?.title ?? <InlineSkeleton width="10em" />}
        </h1>
        <UpdatedAt
          updatedAt={
            typeof menu?.updated_at === "string"
              ? DateTime.fromISO(menu.updated_at)
              : menu?.updated_at
          }
        />
        <DayBrowser menu={menu?.id} />
      </Container>
    </Main>
  );
};

export default MenuPage;
