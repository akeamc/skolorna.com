import { Entry } from "contentful";
import { DateTime } from "luxon";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { BlogPost } from "../../lib/blog/post";
import styles from "./PostGrid.module.scss";

export interface PostCardProps {
  post: Entry<BlogPost>;
}

export const PostCard: FunctionComponent<PostCardProps> = ({ post }) => (
  <Link href={`/blogg/${post.fields.slug}`} passHref>
    <a className={styles.post}>
      <div className={styles.content}>
        <time className={styles.timestamp} dateTime={post.sys.createdAt}>
          {DateTime.fromISO(post.sys.createdAt).toLocaleString(
            DateTime.DATE_MED
          )}
        </time>
        <h2>{post.fields.title}</h2>
        <p>{post.fields.description}</p>
      </div>
      <div className={styles.cover}>
        <img
          src={post.fields.cover.fields.file.url}
          className={styles.cover}
          alt=""
        />
      </div>
    </a>
  </Link>
);

export interface PostGridProps {
  posts: Entry<BlogPost>[];
}

const PostGrid: FunctionComponent<PostGridProps> = ({ posts }) => (
  <div className={styles.grid}>
    {posts.map((post) => (
      <PostCard key={post.sys.id} post={post} />
    ))}
  </div>
);

export default PostGrid;
