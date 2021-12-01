import { Entry } from "contentful";
import React, {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  Fragment,
  FunctionComponent,
  useState,
} from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "../../lib/blog/post";
import { StandardPageHeading } from "../typography/Heading";
import { NarrowContainer } from "./Prose";
import styles from "./PostHeader.module.scss";
import { Author } from "../../lib/blog/author";

export interface Props {
  post: Entry<BlogPost>;
}

const FancyLink = forwardRef<
  HTMLAnchorElement,
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
>(({ children, ...props }, ref) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a style={{ position: "relative" }} ref={ref} {...props}>
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </span>
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
        variants={{
          hidden: {
            height: 1,
            background: "var(--accents-4)",
          },
          visible: {
            height: "100%",
            background: "var(--accents-3)",
          },
        }}
        animate={hovered ? "visible" : "hidden"}
        transition={{ duration: 0.2 }}
      />
    </a>
  );
});

export const Authors: FunctionComponent<{
  authors: Entry<Author>[];
}> = ({ authors }) => (
  <>
    {authors.map((author, i) => (
      <Fragment key={author.sys.id}>
        <Link href={`/${author.fields.slug}`} passHref>
          <FancyLink>{author.fields.name}</FancyLink>
        </Link>
        {i < authors.length - 2 && ", "}
        {i === authors.length - 2 && " och "}
      </Fragment>
    ))}
  </>
);

export const PostHeader: FunctionComponent<Props> = ({ post }) => (
  <header>
    <NarrowContainer>
      <StandardPageHeading>{post.fields.title}</StandardPageHeading>
      <p className={styles.description}>{post.fields.description}</p>
      <div className={styles.byline}>
        <Authors authors={post.fields.authors} />{" "}
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
    </NarrowContainer>
  </header>
);
