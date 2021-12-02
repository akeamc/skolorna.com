import { Entry } from "contentful";
import { DateTime } from "luxon";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { BlogPost } from "../../lib/blog/post";
import {
  normalizeAssetUrl,
} from "../contentful/ProgressiveImage";
import styles from "./PostList.module.scss";

export interface Props {
  posts: Entry<BlogPost>[];
}

export const PostList: FunctionComponent<Props> = ({ posts }) => (
  <ol className={styles.list}>
    {posts.map((post) => (
      <li key={post.sys.id}>
        <Link href={`/blogg/${post.fields.slug}`}>
          <a className={styles.post}>
            <div
              className={styles.image}
              style={{
                backgroundImage: `url(${normalizeAssetUrl(
                  post.fields.cover
                )}?w=256&h=256&fit=fill)`,
              }}
            />
            <div className={styles.text}>
              <h3>{post.fields.title}</h3>
              <time dateTime={post.sys.createdAt}>
                {DateTime.fromISO(post.sys.createdAt)
                  .setLocale("sv")
                  .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
              </time>
            </div>
          </a>
        </Link>
      </li>
    ))}
  </ol>
);
