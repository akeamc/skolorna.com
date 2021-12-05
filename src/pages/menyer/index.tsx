import React from "react";
import { NextPage } from "next";
import Main from "../../components/layout/Main";
import Container from "../../components/layout/Container";
import { MenuSearch } from "../../components/menu/MenuSearch";

const MenuIndex: NextPage = () => (
  <Main>
    <Container>
      <MenuSearch />
    </Container>
  </Main>
);

export default MenuIndex;
