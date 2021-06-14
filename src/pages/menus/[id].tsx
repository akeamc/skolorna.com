import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import useSWR from "swr";
import { MENU_PROXY_URL } from "../../lib/menu-proxy";
import { fetchMenu } from "../../lib/menu-proxy/menu";
import { Day, Menu } from "../../lib/menu-proxy/types";

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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

const MenuPage: NextPage<PageProps> = ({ menu }) => {
  const { data } = useSWR<Day[]>(
    () => new URL(`/menus/${menu.id}/days`, MENU_PROXY_URL).href,
    (url) => fetch(url).then((res) => res.json())
  );

  return (
    <div className="bg-blue-900 text-white min-h-screen">
      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold">{menu?.title}</h1>
        <code className="opacity-30 text-sm">{menu?.id}</code>
        <div className="shadow-lg mt-16 bg-white text-black rounded-lg p-4">
          {data?.map(({ date, meals }) => (
            <div className="mb-4" key={date}>
              <h3 className="text-lg font-semibold">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <ul className="opacity-80">
                {meals.map((meal) => (
                  <li key={meal.value}>{meal.value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
