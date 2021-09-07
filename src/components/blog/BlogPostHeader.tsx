import { Entry } from "contentful";
import { DateTime } from "luxon";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { BlogPost } from "../../lib/blog/post";
import ContentfulImage from "../../lib/contentful/ContentfulImage";
import PageHeading from "../typography/PageHeading";
import styles from "./BlogPostHeader.module.scss";

export interface BlogPostHeaderProps {
  post: Entry<BlogPost>;
}

const BlogPostHeader: FunctionComponent<BlogPostHeaderProps> = ({ post }) => (
  <div className={styles.header}>
    {post.fields.cover && (
      <ContentfulImage asset={post.fields.cover} className={styles.cover} />
    )}
    <PageHeading>{post.fields.title}</PageHeading>
    <p className={styles.description}>{post.fields.description}</p>
    <div className={styles.byline}>
      <time dateTime={post.sys.createdAt}>
        {DateTime.fromISO(post.sys.createdAt).toLocaleString(DateTime.DATE_MED)}
      </time>
      <span>
        {post.fields.authors.map((author) => author.fields.name).join(", ")}
      </span>
    </div>
  </div>
);

export default BlogPostHeader;
