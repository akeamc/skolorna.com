import React from "react";
import { GetStaticProps, NextPage } from "next";
import { Entry } from "contentful";
import Main from "../../components/layout/Main";
import { BlogPost, listBlogPosts } from "../../lib/blog/post";
import Container from "../../components/layout/Container";
import { StandardPageHeading } from "../../components/typography/Heading";
import { PostList } from "../../components/blog/PostList";

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
      <PostList posts={posts} />
    </Container>
  </Main>
);

export default BlogIndex;
