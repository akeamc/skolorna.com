import { Entry } from "contentful";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import PostGrid from "../../components/blog/PostGrid";
import Container from "../../components/layout/Container";
import Main from "../../components/layout/Main";
import PageHeading from "../../components/typography/PageHeading";
import { BlogPost, listBlogPosts } from "../../lib/blog/post";

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

const BlogHome: NextPage<PageProps> = ({ posts }) => (
  <Main title="Blogg">
    <Container>
      <PageHeading>Blogg</PageHeading>
      <PostGrid posts={posts} />
    </Container>
  </Main>
);

export default BlogHome;
