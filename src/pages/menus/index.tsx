import { NextPage } from "next";
import React from "react";
import Main from "../../components/layout/Main";
import Container from "../../components/layout/Container";
import MenuSearch from "../../components/menu/MenuSearch";

const MenusPage: NextPage = () => (
  <Main>
    <Container>
      <MenuSearch />
    </Container>
  </Main>
);

export default MenusPage;
