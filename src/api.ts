import { cache } from "react";

export const getTags = cache(async() => {
  console.log("Executou")

  const response = await fetch("http://localhost:3333/tags", {
    next: {
      tags: ["get-tags"]
    }
  })

  const data = await response.json()

  return data
})