import { BLOCKS } from "@contentful/rich-text-types";
import { Entry } from "contentful";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { PostHeader } from "../../components/blog/PostHeader";
import { Prose } from "../../components/blog/Prose";
import Main from "../../components/layout/Main";
import {
  BlogPost,
  listBlogPosts,
  getBlogPostBySlug,
} from "../../lib/blog/post";
import { lowres } from "../../lib/contentful/lowres";
import NotFound from "../404";

interface PageProps {
  post: Entry<BlogPost> | null;
  previews: Record<string, string> | null;
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

    const entries = await Promise.all(
      post.fields.content.content
        .filter(({ nodeType }) => (nodeType as any) === BLOCKS.EMBEDDED_ASSET)
        .map(async (node) => {
          const asset = node.data.target;
          const b64 = await lowres(asset as any);
          return [asset?.sys.id, b64];
        })
    );

    const previews = Object.fromEntries(entries);

    return {
      props: {
        post,
        previews,
      },
      revalidate: 300,
    };
  } catch (error) {
    return {
      props: {
        post: null,
        previews: null,
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

const BlogPostPage: NextPage<PageProps> = ({ post, previews }) => {
  if (!post) {
    return <NotFound />;
  }

  return (
    <Main>
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
      {previews &&
        Object.entries(previews).map(([id, src]) => (
          <img src={src} key={id} title={id} alt="" />
        ))}
      <PostHeader post={post} />
      <Prose text={post.fields.content} />
    </Main>
  );
};

export default BlogPostPage;
