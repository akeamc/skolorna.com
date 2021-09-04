import { Entry } from "contentful";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import BlogPostView from "../../components/blog/BlogPostView";
import Main from "../../components/layout/Main";
import {
  BlogPost,
  listBlogPosts,
  getBlogPostBySlug,
} from "../../lib/blog/post";
import NotFound from "../404";

interface PageProps {
  post: Entry<BlogPost> | null;
}

interface Q extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<PageProps, Q> = async ({
  params,
}) => {
  const slug = params?.slug;

  if (typeof slug !== "string") {
    throw new Error("?slug must be a string");
  }

  try {
    const post = await getBlogPostBySlug(slug);

    return {
      props: {
        post,
      },
      revalidate: 300,
    };
  } catch (error) {
    return {
      props: {
        post: null,
      },
      revalidate: 60,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await listBlogPosts();

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.fields.slug,
      },
    })),
    fallback: "blocking",
  };
};

const BlogPostPage: NextPage<PageProps> = ({ post }) => {
  if (!post) {
    return <NotFound />;
  }

  return (
    <Main title={post.fields.title} description={post.fields.description}>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={post.fields.cover?.fields.file.url}
        />
        <meta
          property="og:image:width"
          content={post.fields.cover?.fields.file.details.image?.width.toString()}
        />
        <meta
          property="og:image:height"
          content={post.fields.cover?.fields.file.details.image?.height.toString()}
        />
      </Head>
      <BlogPostView post={post} />
    </Main>
  );
};

export default BlogPostPage;
