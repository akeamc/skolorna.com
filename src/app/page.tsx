import BigSearch from "@/components/oden/BigSearch";
import { Stats } from "@/lib/oden";

export default async function Page() {
  const stats: Stats = await fetch(
    "https://api.skolorna.com/v03/oden/stats"
  ).then((res) => res.json());

  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <BigSearch stats={stats} />
      <div className="my-8 flex max-sm:flex-col sm:items-center sm:justify-between sm:gap-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Skolorna
        </h1>
      </div>
    </main>
  );
}
