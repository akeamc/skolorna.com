import React, { FunctionComponent } from "react";
import Head from "next/head";

export interface SeoProps {
  title?: string;
  description?: string;
}

const Seo: FunctionComponent<SeoProps> = ({
  title = "Skolorna",
  description,
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content="Skolorna" />
    <meta property="og:locale" content="sv_SE" />
  </Head>
);

export default Seo;
