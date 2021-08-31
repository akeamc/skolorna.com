import { Entry } from "contentful";
import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { BlogPost } from "../../lib/blog/post";
import PageHeading from "../typography/PageHeading";
import styles from "./BlogPostHeader.module.scss";

export interface BlogPostHeaderProps {
  post: Entry<BlogPost>;
}

const BlogPostHeader: FunctionComponent<BlogPostHeaderProps> = ({ post }) => (
  <div className={styles.header}>
    {post.fields.cover && (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img src={post.fields.cover.fields.file.url} className={styles.cover} />
    )}
    <PageHeading>{post.fields.title}</PageHeading>
    <p className={styles.description}>{post.fields.description}</p>
    <div className={styles.byline}>
      <time dateTime={post.sys.createdAt}>
        {DateTime.fromISO(post.sys.createdAt).toLocaleString(DateTime.DATE_MED)}
      </time>
    </div>
  </div>
);

export default BlogPostHeader;
