import Days from "@/components/oden/Days";
import HistoryRecorder from "@/components/oden/HistoryRecorder";
import { Menu, ODEN_URL } from "@/lib/oden";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const runtime = "edge";

interface Params {
  id: string;
}

interface Props {
  params: Params;
}

async function getMenu(id: string) {
  const res = await fetch(`${ODEN_URL}/menus/${id}`, {
    next: {
      revalidate: 300,
    },
  });
  if (!res.ok) return notFound();
  const menu: Menu = await res.json();
  return menu;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const menu = await getMenu(props.params.id);

  return {
    title: menu.title,
  };
}

export default async function Page({ params: { id } }: Props) {
  const menu = await getMenu(id);

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <HistoryRecorder menu={menu.id} />
      <div className="my-8 flex max-sm:flex-col sm:items-center sm:justify-between sm:gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          {menu.title}
        </h1>
        <span className="text-sm font-medium text-gray-500">
          {new Intl.DateTimeFormat("sv").format(new Date(menu.checked_at))}
        </span>
      </div>
      <Days menu={id} />
    </main>
  );
}
