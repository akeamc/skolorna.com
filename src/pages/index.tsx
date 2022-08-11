import React from "react";
import { NextPage, GetStaticProps } from "next";
import Main from "../components/layout/Main";
import { HomeHero } from "../components/home/HomeHero";
import { getStats, MenuStats } from "../lib/oden/stats";

interface Props {
  stats: MenuStats;
}

const Home: NextPage<Props> = ({ stats }) => (
  <Main>
    <HomeHero stats={stats} />
  </Main>
);

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: {
    stats: await getStats(),
  },
  revalidate: 3600,
});

export default Home;
