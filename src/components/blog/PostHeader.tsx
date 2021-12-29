import { Entry } from "contentful";
import React, { Fragment, FunctionComponent } from "react";
import { DateTime } from "luxon";
import { BlogPost } from "../../lib/blog/post";
import { StandardPageHeading } from "../typography/Heading";
import { Narrow, ProseContainer, WideProseImage } from "./Prose";
import styles from "./PostHeader.module.scss";
import { Author } from "../../lib/blog/author";

export interface Props {
  post: Entry<BlogPost>;
}

export const Authors: FunctionComponent<{
  authors: Entry<Author>[];
}> = ({ authors }) => (
  <>
    {authors.map((author, i) => (
      <Fragment key={author.sys.id}>
        {author.fields.name}
        {/* <Link href={`/${author.fields.slug}`} passHref>
          <FancyLink>{author.fields.name}</FancyLink>
        </Link> */}
        {i < authors.length - 2 && ", "}
        {i === authors.length - 2 && " och "}
      </Fragment>
    ))}
  </>
);

export const PostHeader: FunctionComponent<Props> = ({ post }) => {
  const { title, description, cover, authors } = post.fields;

  return (
    <header>
      <ProseContainer>
        <Narrow>
          <StandardPageHeading>{title}</StandardPageHeading>
          <p className={styles.description}>{description}</p>
          <div className={styles.byline}>
            <Authors authors={authors} />{" "}
            <time dateTime={post.sys.createdAt}>
              {DateTime.fromISO(post.sys.createdAt).toLocaleString({
                hour: "numeric",
                minute: "numeric",
                day: "numeric",
                month: "short",
                year: "numeric",
                locale: "sv",
              })}
            </time>
          </div>
        </Narrow>
        <WideProseImage asset={cover} />
      </ProseContainer>
    </header>
  );
};
