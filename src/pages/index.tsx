import { GetStaticProps, NextPage } from "next";
import React from "react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import HomeHero, { Doodle } from "../components/home/HomeHero";
import Alerts from "../components/layout/Alerts";
import Main from "../components/layout/Main";
import { fetchMenus } from "../lib/menu/menu";
import { hashCode } from "../lib/utils/hash";

interface PageProps {
  doodle: Doodle;
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const menus = await fetchMenus();

  const set = menus.reduce(
    (acc, menu) => acc.set(hashCode(menu.title), menu.title),
    new Map<number, string>()
  );

  return {
    props: {
      doodle: Array.from(set.entries())
        .sort((a, b) => a[0] - b[0])
        .slice(0, 1000)
        .map((e) => e[1])
        .join("; "),
    },
  };
};

const Home: NextPage<PageProps> = ({ doodle }) => (
  <Main
    description="Elever i alla skolor, förena er! Vi vet vad det blir till lunch."
    before={<Alerts />}
  >
    <HomeHero doodle={doodle} />
    <Signup />
    <Login />
  </Main>
);

export default Home;
