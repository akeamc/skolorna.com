import { GetStaticProps, NextPage } from "next";
import React from "react";
import Container from "../components/layout/Container";
import Main from "../components/layout/Main";
import { searchClient } from "../lib/oden/search";

interface PageProps {
  menuCount: number;
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  console.log(await searchClient.getRawIndex("menus"));

  return {
    props: {
      menuCount: 1
    },
  };
}

const Home: NextPage<PageProps> = ({menuCount}) => (
  <Main>
    <Container>
      <h1>Vi vet vad det blir för mat</h1>
      <p>{menuCount}</p>
    </Container>
  </Main>
);

export default Home;
