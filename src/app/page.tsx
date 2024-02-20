import { Tags } from "./tags";
import { AddTag } from "./add-tag";
import { Suspense, cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";

const getCurrentDate = unstable_cache (async() => {
  return new Date().toISOString()
}, [], {
  revalidate: false,
  tags: ["current-date"]
})

export default async function Home() {
  const currentDate = await getCurrentDate()

  async function refreshCurrentDate() {
    "use server"

    revalidateTag("current-date")
  }

  return (
    <div>
      {currentDate}
      <form action={refreshCurrentDate}>
        <button type="submit">Refresh current date</button>
      </form>

      <hr />
      <Suspense fallback={<p>Carregando tags...</p>}>
        <Tags />
      </Suspense>

      <hr />
      <Tags />
      <Tags />
      <hr />
      
      <AddTag />
    </div>
  );
}
