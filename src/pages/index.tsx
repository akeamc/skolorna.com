import { NextPage } from "next";
import React from "react";
import HomeHero from "../components/home/HomeHero";
import Main from "../components/layout/Main";

const Home: NextPage = () => (
  <Main description="Skolorna är ett fristående företag av elever, för elever. Just nu kan du se vad det blir för lunch på din skola.">
    <HomeHero />
  </Main>
);

export default Home;
