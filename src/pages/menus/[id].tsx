import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import useSWR from "swr";
import { Day, Menu } from "../../types";

export interface PageProps {
	menu: Menu;
}

export interface Q extends ParsedUrlQuery {
	id: string;
}

export const getStaticProps: GetStaticProps<PageProps, Q> = async ({ params }) => {
	const res = await fetch(`http://localhost:8000/menus/${params?.id}`);
	const menu: Menu = await res.json();

	return {
		props: {
			menu,
		}
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
}

const MenuPage: NextPage<PageProps> = ({
	menu,
}) => {
	const { data } = useSWR<Day[]>(() => `http://localhost:8000/menus/${menu.id}/days`, (url) => fetch(url).then(res => res.json()));

	return (
		<>
			<h1>{menu?.title}</h1>
			<code>{menu?.id}</code>
			<div>
				{data?.map(({ date, meals }) => (
					<div>
						<h3>{new Date(date).toLocaleDateString(undefined, {
							dateStyle: "long"
						})}</h3>
						<ul>
							{meals.map((meal) => <li>{meal.value}</li>)}
						</ul>
					</div>
				))}
			</div>
		</>
	);
}

export default MenuPage;
