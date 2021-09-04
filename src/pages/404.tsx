import React from "react";
import { NextPage } from "next";
import Matrix from "../components/canvas/Matrix";
import Seo from "../components/Seo";

const NotFound: NextPage = () => (
  <>
    <Seo title="Sidan finns inte" />
    <Matrix target="ERROR 404" />
  </>
);

export default NotFound;
