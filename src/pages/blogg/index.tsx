import { Entry } from "contentful";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
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
  };
};

const BlogHome: NextPage<PageProps> = ({ posts }) => (
  <Main title="Blogg">
    <Container>
      <PageHeading>Blogg</PageHeading>
      <ul>
        {posts.map((post) => (
          <li key={post.sys.id}>
            <Link href={`/blogg/${post.fields.slug}`}>
              <a>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={post.fields.cover?.fields.file.url} />
                <h1>{post.fields.title}</h1>
                <p>{post.fields.description}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  </Main>
);

export default BlogHome;
