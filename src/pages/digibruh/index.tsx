import React from "react";
import { Entry } from "contentful";
import { GetStaticProps, NextPage } from "next";
import Container from "../../components/layout/Container";
import Main from "../../components/layout/Main";
import {
  DigibruhArticle,
  listDigibruhArticles,
} from "../../lib/digibruh/article";
import { StandardPageHeading } from "../../components/typography/Heading";
import { ArticleBoard } from "../../components/digibruh/ArticleBoard";

interface PageProps {
  articles: Entry<DigibruhArticle>[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const articles = await listDigibruhArticles();

  return {
    props: {
      articles,
    },
    revalidate: 600,
  };
};

const DigibruhIndex: NextPage<PageProps> = ({ articles }) => (
  <Main title="Digibruh™">
    <Container>
      <StandardPageHeading>Digibruh™</StandardPageHeading>
      <ArticleBoard articles={articles} />
    </Container>
  </Main>
);

export default DigibruhIndex;
