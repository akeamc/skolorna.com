import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { Entry } from "contentful";
import React, { FunctionComponent } from "react";
import { BlogPost } from "../../lib/blog/post";
import Container from "../layout/Container";
import AuthorCard from "./AuthorCard";
import BlogPostHeader from "./BlogPostHeader";
import styles from "./BlogPostView.module.scss";

export interface BlogPostViewProps {
  post: Entry<BlogPost>;
}

const BlogPostView: FunctionComponent<BlogPostViewProps> = ({ post }) => {
  const content = documentToReactComponents(post.fields.content as any, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
        const { file, title, description } = data.target.fields;

        if (file.details.image) {
          return <img src={file.url} title={title} alt={description} />;
        }

        return null;
      },
    },
  });

  return (
    <Container document>
      <BlogPostHeader post={post} />
      <div className={styles.content}>{content}</div>
      <div className={styles.footer}>
        {post.fields.authors.map((author) => (
          <AuthorCard key={author.sys.id} author={author.fields} />
        ))}
      </div>
    </Container>
  );
};

export default BlogPostView;
