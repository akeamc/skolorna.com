import { NextPage } from "next";
import React from "react";
import Main from "../components/layout/Main";
import { StandardPageHeading } from "../components/typography/Heading";

const NotFound: NextPage = () => (
  <Main title="Sidan hittades inte">
    <StandardPageHeading>404</StandardPageHeading>
  </Main>
);

export default NotFound;
