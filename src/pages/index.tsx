import React from "react";
import { NextPage } from "next";
import Main from "../components/layout/Main";
import { StandardPageHeading } from "../components/typography/Heading";

const Home: NextPage = () => (
  <Main>
    <StandardPageHeading>Skolorna</StandardPageHeading>
  </Main>
);

export default Home;
