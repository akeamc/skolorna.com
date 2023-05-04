"use client";

import { Meals } from "@/components/oden/Stats";

export default function Page() {
  return (
    <main className="mx-auto max-w-screen-lg px-4">
      <div className=" my-16 flex items-center justify-center">
        <h1 className="text-center text-6xl font-semibold tracking-tight md:text-8xl">
          <Meals />
        </h1>
      </div>
    </main>
  );
}
