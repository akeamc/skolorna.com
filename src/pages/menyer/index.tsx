import { NextPage } from "next";
import React from "react";
import Main from "../../components/layout/Main";
import Container from "../../components/layout/Container";
import MenuSearch from "../../components/menu/MenuSearch";
import RecentMenus from "../../components/menu/RecentMenus";

const MenusPage: NextPage = () => (
  <Main
    title="Menyer"
    description="Sök bland över 7000 olika skolor och se vad det blir till lunch."
  >
    <Container>
      <RecentMenus />
      <MenuSearch />
    </Container>
  </Main>
);

export default MenusPage;
