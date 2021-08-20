import { NextPage } from "next";
import React from "react";
import HomeHero from "../components/home/HomeHero";
import Main from "../components/layout/Main";

const Home: NextPage = () => (
  <Main description="Elever i alla skolor, förena er! Vi vet vad det blir till lunch.">
    <HomeHero />
  </Main>
);

export default Home;
