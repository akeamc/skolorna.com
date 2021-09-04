import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import Seo from "../components/Seo";
import ArrowLink from "../components/link/ArrowLink";
import PageHeading from "../components/typography/PageHeading";

const NotFound: NextPage = () => (
  <div className="root">
    <Seo title="Sidan finns inte" />
    <div className="text">
      <PageHeading style={{ marginTop: 0 }}>Sidan finns inte.</PageHeading>
      <Link href="/" passHref>
        <ArrowLink>Återvänd</ArrowLink>
      </Link>
    </div>
    <style jsx>{`
      .root {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: var(--page-gutter);
        box-sizing: border-box;
      }

      .text {
        max-width: 768px;
        text-align: center;
      }
    `}</style>
  </div>
);

export default NotFound;
