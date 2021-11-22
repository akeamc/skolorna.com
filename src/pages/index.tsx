import { GetStaticProps, NextPage } from "next";
import React from "react";
import { HomeHero } from "../components/layout/HomeHero";
import Main from "../components/layout/Main";
import { getMenus } from "../lib/oden/menus";

interface PageProps {
  menus: string[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const menus = await getMenus();

  return {
    props: {
      menus: menus.slice(0, 100).map((m) => m.title),
    },
  };
};

const Home: NextPage<PageProps> = ({ menus }) => (
  <Main>
    <HomeHero menus={menus} />
  </Main>
);

export default Home;
