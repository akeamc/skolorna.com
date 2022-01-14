import { Asset, Entry } from "contentful";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { PostHeader } from "../../components/blog/PostHeader";
import { Prose } from "../../components/blog/Prose";
import { normalizeAssetUrl } from "../../components/contentful/ProgressiveImage";
import Main from "../../components/layout/Main";
import {
  BlogPost,
  listBlogPosts,
  getBlogPost,
  getPreviewBlogPost,
} from "../../lib/blog/post";
import {
  extractAssets,
  generatePlaceholders,
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
      ...extractAssets(post.fields.content),
    ];

    const placeholders = await generatePlaceholders(assets);

    return {
      props: {
        post,
        placeholders,
      },
      revalidate: 300,
    };
  } catch (error) {
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

  const { cover } = post.fields;

  return (
    <PlaceholderContext.Provider value={placeholders ?? {}}>
      <Main title={post.fields.title} description={post.fields.description}>
        <Head>
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:type" content="article" />
          <meta
            property="og:article:published_time"
            content={post.sys.createdAt}
          />
          <meta
            property="og:article:modified_time"
            content={post.sys.updatedAt}
          />
          <meta
            property="og:image"
            content={`${normalizeAssetUrl(cover)}?w=1200`}
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:alt" content={cover.fields.description} />
        </Head>
        <PostHeader post={post} />
        <Prose text={post.fields.content} />
      </Main>
    </PlaceholderContext.Provider>
  );
};

export default BlogPostPage;
