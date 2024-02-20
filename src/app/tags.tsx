import { getTags } from "@/api"
import { unstable_noStore } from "next/cache"

export async function Tags(){
  unstable_noStore()

  const data = await getTags()

  return(
    <ul>
      {data.map((item: any) => <li key={item.id}>{item.slug}</li>)}
    </ul>
  )
}