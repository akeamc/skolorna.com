import React from "react";
import { GetStaticProps, NextPage } from "next";
import { Entry } from "contentful";
import Link from "next/link";
import Main from "../../components/layout/Main";
import { BlogPost, listBlogPosts } from "../../lib/blog/post";
import Container from "../../components/layout/Container";
import { StandardPageHeading } from "../../components/typography/Heading";

interface PageProps {
  posts: Entry<BlogPost>[];
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const posts = await listBlogPosts();

  return {
    props: {
      posts,
    },
    revalidate: 600,
  };
};

const BlogIndex: NextPage<PageProps> = ({ posts }) => (
  <Main>
    <Container>
      <StandardPageHeading>Blogg</StandardPageHeading>
    </Container>
    {posts.map((post) => (
      <Link href={`/blogg/${post.fields.slug}`} key={post.sys.id}>
        <a>
          <h2>{post.fields.title}</h2>
          <p>{post.fields.description}</p>
          <img
            src={post.fields.cover.fields.file.url}
            alt={post.fields.cover.fields.description}
            title={post.fields.cover.fields.title}
          />
        </a>
      </Link>
    ))}
  </Main>
);

export default BlogIndex;
