import React from "react";
import { Asset, Entry } from "contentful";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { Prose } from "../../components/blog/Prose";
import { normalizeAssetUrl } from "../../components/contentful/ProgressiveImage";
import Main from "../../components/layout/Main";
import {
  extractAssets,
  generatePlaceholders,
  PlaceholderContext,
  PlaceholderTable,
} from "../../lib/contentful/placeholder";
import {
  DigibruhArticle,
  getDigibruhArticle,
  listDigibruhArticles,
} from "../../lib/digibruh/article";
import NotFound from "../404";

interface PageProps {
  article: Entry<DigibruhArticle> | null;
  placeholders: PlaceholderTable | null;
}

interface Q extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<PageProps, Q> = async ({
  params,
}) => {
  const slug = params?.slug;

  if (typeof slug !== "string") {
    throw new Error("?slug must be a string");
  }

  try {
    const article = await getDigibruhArticle(slug);

    const assets: Asset[] = [
      article.fields.cover,
      ...extractAssets(article.fields.content),
    ];

    const placeholders = await generatePlaceholders(assets);

    return {
      props: {
        article,
        placeholders,
      },
      revalidate: 300,
    };
  } catch (error) {
    return {
      props: {
        article: null,
        placeholders: null,
      },
      revalidate: 60,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await listDigibruhArticles();

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.fields.slug,
      },
    })),
    fallback: "blocking",
  };
};

const DigibruhArticlePage: NextPage<PageProps> = ({
  article,
  placeholders,
}) => {
  if (!article) {
    return <NotFound />;
  }

  const { title, description, cover, content } = article.fields;

  return (
    <PlaceholderContext.Provider value={placeholders ?? {}}>
      <Main title={title} description={description}>
        <Head>
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:type" content="article" />
          <meta
            property="og:article:published_time"
            content={article.sys.createdAt}
          />
          <meta
            property="og:article:modified_time"
            content={article.sys.updatedAt}
          />
          <meta
            property="og:image"
            content={`${normalizeAssetUrl(cover)}?w=1200`}
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:alt" content={cover.fields.description} />
        </Head>
        <h1>{title}</h1>
        <Prose text={content} />
      </Main>
    </PlaceholderContext.Provider>
  );
};

export default DigibruhArticlePage;
