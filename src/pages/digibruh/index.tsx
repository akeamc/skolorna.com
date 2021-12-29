import React from "react";
import { Entry } from "contentful";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Container from "../../components/layout/Container";
import Main from "../../components/layout/Main";
import {
  DigibruhArticle,
  listDigibruhArticles,
} from "../../lib/digibruh/article";
import { StandardPageHeading } from "../../components/typography/Heading";

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
      <ul>
        {articles.map((article) => (
          <li key={article.sys.id}>
            <Link href={`/digibruh/${article.fields.slug}`}>
              <a>
                <h3>{article.fields.title}</h3>
                <img
                  src={article.fields.cover.fields.file.url}
                  alt={article.fields.cover.fields.description}
                />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  </Main>
);

export default DigibruhIndex;
