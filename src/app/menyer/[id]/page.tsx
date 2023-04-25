import Days from "@/components/oden/Days";
import HistoryRecorder from "@/components/oden/HistoryRecorder";
import MenuSearch from "@/components/oden/MenuSearch";
import { Menu, ODEN_URL } from "@/lib/oden";
import { notFound } from "next/navigation";

interface Params {
  id: string;
}

export default async function Page({ params: { id } }: { params: Params }) {
  const res = await fetch(`${ODEN_URL}/menus/${id}`, {
    next: {
      revalidate: 300,
    },
  });
  if (!res.ok) return notFound();
  const menu: Menu = await res.json();

  return (
    <main className="mx-auto max-w-screen-lg px-2">
      <HistoryRecorder menu={menu.id} />
      <MenuSearch />
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
