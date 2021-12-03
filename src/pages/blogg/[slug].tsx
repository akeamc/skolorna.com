import { BLOCKS } from "@contentful/rich-text-types";
import { Asset, Entry } from "contentful";
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
  getBlogPost,
  getPreviewBlogPost,
} from "../../lib/blog/post";
import {
  generatePlaceholder,
  PlaceholderContext,
  PlaceholderTable,
} from "../../lib/contentful/placeholder";
import NotFound from "../404";

interface PageProps {
  post: Entry<BlogPost> | null;
  placeholders: PlaceholderTable | null;
}

interface Q extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<PageProps, Q> = async ({
  params,
  preview,
}) => {
  const slug = params?.slug;

  if (typeof slug !== "string") {
    throw new Error("?slug must be a string");
  }

  try {
    let post;

    if (preview) {
      post = await getPreviewBlogPost(slug);
    } else {
      post = await getBlogPost(slug);
    }

    const assets: Asset[] = [
      post.fields.cover,
      ...post.fields.content.content
        .filter(({ nodeType }) => (nodeType as any) === BLOCKS.EMBEDDED_ASSET)
        .map((node) => node.data.target as any),
    ];

    const placeholders = Object.fromEntries(
      await Promise.all(
        assets.map((asset) =>
          generatePlaceholder(asset as any).then((b64) => [asset?.sys.id, b64])
        )
      )
    );

    return {
      props: {
        post,
        placeholders,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        post: null,
        placeholders: null,
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

const BlogPostPage: NextPage<PageProps> = ({ post, placeholders }) => {
  if (!post) {
    return <NotFound />;
  }

  return (
    <PlaceholderContext.Provider value={placeholders ?? {}}>
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
        <PostHeader post={post} />
        <Prose text={post.fields.content} />
      </Main>
    </PlaceholderContext.Provider>
  );
};

export default BlogPostPage;
