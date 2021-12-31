import { Entry } from "contentful";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { DigibruhArticle } from "../../lib/digibruh/article";
import { ProgressiveImage } from "../contentful/ProgressiveImage";
import styles from "./ArticleBoard.module.scss";

interface Props {
  articles: Entry<DigibruhArticle>[];
}

export const ArticleBoard: FunctionComponent<Props> = ({ articles }) => (
  <div className={styles.container}>
    {articles.map((article) => (
      <Link href={`/digibruh/${article.fields.slug}`} passHref>
        <a className={styles.articleWrapper}>
          <article key={article.sys.id} className={styles.article}>
            <div className={styles.text}>
              <h3 className={styles.heading}>{article.fields.title}</h3>
              <p>{article.fields.description}</p>
            </div>
            <div className={styles.media}>
              <ProgressiveImage asset={article.fields.cover} />
            </div>
          </article>
        </a>
      </Link>
    ))}
  </div>
);
