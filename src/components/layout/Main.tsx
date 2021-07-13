import React, { FunctionComponent } from "react";
import Nav from "./Nav";

const Main: FunctionComponent = ({ children }) => (
  <>
    <Nav />
    <main>{children}</main>
  </>
);

export default Main;
