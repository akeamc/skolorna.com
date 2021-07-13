import React, { FunctionComponent } from "react";
import Footer from "./Footer";
import Nav from "./Nav";

const Main: FunctionComponent = ({ children }) => (
  <>
    <Nav />
    <main>{children}</main>
    <Footer />
  </>
);

export default Main;
