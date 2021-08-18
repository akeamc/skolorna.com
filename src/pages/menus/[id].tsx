import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Main from "../../components/layout/Main";
import Container from "../../components/layout/Container";
import { fetchMenu } from "../../lib/menu/menu";
import { Menu } from "../../lib/menu/types";
import PageHeading from "../../components/typography/PageHeading";
import InlineSkeleton from "../../components/skeleton/InlineSkeleton";
import DayListSection from "../../components/menu/DayListSection";
import { useMenuHistory } from "../../lib/menu/history";

export interface PageProps {
  menu: Menu | null;
}

export interface Q extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<PageProps, Q> = async ({
  params,
}) => {
  const id = params?.id;

  if (typeof id !== "string") {
    throw new Error("?id must be a string");
  }

  try {
    const menu = await fetchMenu(id);
    return {
      props: {
        menu,
      },
      revalidate: 86400,
    };
  } catch (error) {
    return {
      props: {
        menu: null,
      },
      revalidate: 60,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

const MenuPage: NextPage<PageProps> = ({ menu }) => {
  const { isFallback } = useRouter();
  const history = useMenuHistory();

  useEffect(() => {
    if (menu?.id) {
      history.add(menu.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu?.id]);

  if (!isFallback && !menu) {
    return <>404</>;
  }

  return (
    <Main title={menu?.title}>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:title" content={menu?.title} />
        <meta property="og:type" content="object" />
        <meta property="og:image" content={`https://api.skolorna.com/v1/opengraph/menus/${menu?.id ?? ""}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
      </Head>
      <Container>
        <PageHeading>
          {menu?.title ?? <InlineSkeleton width="16em" count={2} />}
        </PageHeading>
        <DayListSection menu={menu?.id} />
      </Container>
    </Main>
  );
};

export default MenuPage;
