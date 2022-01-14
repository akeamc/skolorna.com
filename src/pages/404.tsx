import { NextPage } from "next";
import React from "react";
import Container from "../components/layout/Container";
import Main from "../components/layout/Main";
import { StandardPageHeading } from "../components/typography/Heading";

const NotFound: NextPage = () => (
  <Main title="Sidan hittades inte">
    <Container>
      <StandardPageHeading>Sidan hittades inte</StandardPageHeading>
    </Container>
  </Main>
);

export default NotFound;
