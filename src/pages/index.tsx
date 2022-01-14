import React from "react";
import { NextPage } from "next";
import Main from "../components/layout/Main";
import { HomeHero } from "../components/home/HomeHero";

const Home: NextPage = () => (
  <Main>
    <HomeHero />
  </Main>
);

export default Home;
