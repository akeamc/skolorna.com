import React from "react";
import { Entry } from "contentful";
import { GetStaticProps, NextPage } from "next";
import Container from "../../components/layout/Container";
import Main from "../../components/layout/Main";
import {
  EncyclopediaArticle,
  listEncyclopediaArticles,
} from "../../lib/encyclopedia/article";
import { StandardPageHeading } from "../../components/typography/Heading";
import { ArticleBoard } from "../../components/encyclopedia/ArticleBoard";

interface PageProps {
  articles: Entry<EncyclopediaArticle>[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const articles = await listEncyclopediaArticles();

  return {
    props: {
      articles,
    },
    revalidate: 600,
  };
};

const EncyclopediaIndex: NextPage<PageProps> = ({ articles }) => (
  <Main title="Skolornas Encyclopedi">
    <Container>
      <StandardPageHeading>Skolornas Encyklopedi</StandardPageHeading>
      <ArticleBoard articles={articles} />
    </Container>
  </Main>
);

export default EncyclopediaIndex;
