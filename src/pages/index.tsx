import React, { FunctionComponent } from "react";
import { NextPage } from "next";
import Main from "../components/layout/Main";
import { InstantMenuSearch } from "../lib/oden/instantsearch";
import { Hits, SearchBox } from "react-instantsearch-dom";
import { Hit } from "../components/menu/search/Hit";

const Home: NextPage = () => (
  <Main>
    <InstantMenuSearch>
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantMenuSearch>
  </Main>
);

export default Home;
