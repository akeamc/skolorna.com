"use client";

import { useStats } from "@/lib/oden/hooks";

export default function Page() {
  const { data: stats } = useStats();

  return (
    <main className="main">
      <div className="my-16 flex flex-col items-center justify-center">
        <h1 className="text-center text-6xl font-semibold tracking-tight md:text-8xl">
          Vi vet vad det blir till lunch
        </h1>
        <p className="mt-4 text-center text-xl text-gray-600">
          Vi har sparat {stats?.meals.toLocaleString("sv") || "supermånga"}{" "}
          måltider.
        </p>
      </div>
    </main>
  );
}
