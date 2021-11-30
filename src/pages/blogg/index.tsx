import React from "react";
import { GetStaticProps, NextPage } from "next";
import { Entry } from "contentful";
import Main from "../../components/layout/Main";
import { BlogPost, listBlogPosts } from "../../lib/blog/post";
import Container from "../../components/layout/Container";

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
      <h1 style={{ fontSize: 96, fontWeight: 400 }}>Blogg</h1>
    </Container>
    {posts.map((post) => (
      <div key={post.sys.id}>
        <h2>{post.fields.title}</h2>
        <p>{post.fields.description}</p>
        <img
          src={post.fields.cover.fields.file.url}
          alt={post.fields.cover.fields.description}
          title={post.fields.cover.fields.title}
        />
      </div>
    ))}
  </Main>
);

export default BlogIndex;
