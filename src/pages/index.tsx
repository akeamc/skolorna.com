import { NextPage } from "next";
import React from "react";
import HomeHero from "../components/home/HomeHero";
import Main from "../components/layout/Main";

const Home: NextPage = () => (
  <Main>
    <HomeHero />
  </Main>
);

export default Home;
