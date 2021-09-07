import React, { FunctionComponent } from "react";
import { Author } from "../../lib/blog/author";
import ContentfulImage from "../../lib/contentful/ContentfulImage";
import styles from "./AuthorCard.module.scss";

export interface AuthorCardProps {
  author: Author;
}

const AuthorCard: FunctionComponent<AuthorCardProps> = ({ author }) => (
  <div className={styles.card}>
    <ContentfulImage
      asset={author.avatar}
      width={30}
      height={30}
      loading="lazy"
      className={styles.avatar}
    />
    <div className={styles.name}>{author.name}</div>
  </div>
);

export default AuthorCard;
