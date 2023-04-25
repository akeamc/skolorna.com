import RecentMenus from "@/components/oden/RecentMenus";
import SearchProvider from "@/components/search/SearchProvider";
import { Stats } from "@/lib/oden";

export default async function Page() {
  const stats: Stats = await fetch(
    "https://api.skolorna.com/v03/oden/stats"
  ).then((res) => res.json());

  return (
    <main className="mx-auto max-w-screen-lg px-2">
      <SearchProvider index="menus">

      </SearchProvider>
      <RecentMenus />
      <div className="my-8 flex max-sm:flex-col sm:items-center sm:justify-between sm:gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Oden
        </h1>
      </div>
      <div className="my-8 flex max-sm:flex-col sm:items-center sm:justify-between sm:gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          {stats.menus} menyer
        </h1>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          {stats.meals?.toLocaleString("sv")} dagar
        </h1>
      </div>
    </main>
  );
}
