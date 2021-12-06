import React from "react";
import { NextPage } from "next";
import Main from "../../components/layout/Main";
import { Discover } from "../../components/menu/Discover";

const MenuIndex: NextPage = () => (
  <Main>
    <Discover />
  </Main>
);

export default MenuIndex;
