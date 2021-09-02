import React, { FunctionComponent } from "react";
import { ColorSwatch } from "../components/brand/color";
import Container from "../components/layout/Container";
import Main from "../components/layout/Main";
import PageHeading from "../components/typography/PageHeading";

const BrandPage: FunctionComponent = () => (
  <Main title="Varumärke">
    <Container>
      <PageHeading>Varumärke</PageHeading>
      <ColorSwatch
        names={Array.from({ length: 10 }).map((_, i) => `accents-${i + 1}`)}
      />
    </Container>
  </Main>
);

export default BrandPage;
