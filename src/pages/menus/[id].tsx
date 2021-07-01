import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import Main from "../../components/layout/Main";
import Container from "../../components/layout/Container";
import { useDays } from "../../lib/menu-proxy/days";
import { fetchMenu } from "../../lib/menu-proxy/menu";
import { Menu } from "../../lib/menu-proxy/types";
import PageHeading from "../../components/typography/PageHeading";

export interface PageProps {
  menu: Menu;
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

  const menu = await fetchMenu(id);

  return {
    props: {
      menu,
    },
    revalidate: 86400,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

const MenuPage: NextPage<PageProps> = ({ menu }) => {
  const { data } = useDays({ menu: menu?.id });

  return (
    <Main>
      <Container>
        <PageHeading>{menu?.title}</PageHeading>
        <div>
          {data?.map(({ date, meals }) => (
            <div className="mb-4" key={date}>
              <h3>
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <ul>
                {meals.map((meal) => (
                  <li key={meal.value}>{meal.value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Main>
  );
};

export default MenuPage;
