import { NextPage } from "next";
import React from "react";
import Main from "../../components/layout/Main";
import Container from "../../components/layout/Container";
import MenuSearch from "../../components/menu/MenuSearch";
import RecentMenus from "../../components/menu/RecentMenus";

const MenusPage: NextPage = () => (
  <Main>
    <Container>
      <RecentMenus />
      <MenuSearch />
    </Container>
  </Main>
);

export default MenusPage;
