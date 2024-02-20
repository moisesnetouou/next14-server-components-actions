# Next.js 14 - Server Components & Actions

Agora é possível fazer requisições com Next.js 14

```bash
API: npx json-server server.json -p 3333 --watch
RUN: npm run dev
```

```tsx
export async function Tags(){
  await new Promise(resolve => setTimeout(resolve, 3000))

  const response = await fetch("http://localhost:3333/tags", {
    next: {
      tags: ["get-tags"]
    }
  })
  const data = await response.json()

  console.log(data)

  return(
    <ul>
      {data.map((item: any) => <li key={item.id}>{item.slug}</li>)}
    </ul>
  )
}
```

O `new Promise` é apenas para simular os 3 segundos de carregamento de tags no primeiro momento do acesso do cliente.

Dentro do response daquele `next` vai servir para determinar uma espécie de id para a requisição, porque agora ele tem cache, e precisamos desse id para revalidar ela futuramente.

Esse `Server Component`ajuda bastante na hora de dizer o que vai ser renderizado pelo lado do servidor ou não, e com isso ganhamos certa performance, um certo ganho de tempo pelo fato desses dados estarem mais próximos do servidor.

E com isso, também podemos utilizar uma `Server Action`

```tsx
import { revalidateTag } from "next/cache"
import { AddTagButton } from "./add-tag-button"

export async function AddTag(){
  async function handleCreateTag(form: FormData){
    "use server"

    const slug = form.get("slug")

    if(!slug){
      return
    }

    await new Promise(resolve => setTimeout(resolve, 3000))

    await fetch("http://localhost:3333/tags", {
      method: "POST",
      body: JSON.stringify({
        slug
      })
    })

    revalidateTag("get-tags")
  }
  
  return(
    <form action={handleCreateTag}>
      <input 
        type="text" 
        name="slug" 
        placeholder="Slug da tag" 
        className="placeholder:text-slate-950 text-slate-800"
      />
      
      <AddTagButton />
    </form>
  )
}
```

Neste componente, não utilizamos nada que seja renderizado pelo lado do client (exceto o AddTagButton, mas, ele já está sendo tratado dentro de seu componente), com o `“use server”` vamos incorporar uma ação do servidor.

Neste exemplo, apenas estamos salvando novas slugs, e o `revalidateTag` que vem do `next/cache` vai servir para revalidar nossa requisição, para que tenha um novo carregamento de tela e liste nossas novas tags.

Separamos o `AddTagButton`para adicionar uma condição dentro dele, uma condição para deixar ele desabilitado quando for feito a requisição e que seja mostrado em tela

```tsx
"use client"

import { useFormStatus } from "react-dom"

export function AddTagButton(){
  const { pending } = useFormStatus()
  
  return(
    <button type="submit" disabled={pending}>
      {pending ? "Carregando..." : "Salvar tag"}
    </button>
  )
}
```

Atualmente no dia 20/02/2024 o hook do React.js chamado de useFormStatus está experimental, mas, ele fornece informações de status do último envio do formulário.

```bash
const { pending, data, method, action } = useFormStatus();
```

Voltando ao componente de Tags

```tsx
export async function Tags(){
  await new Promise(resolve => setTimeout(resolve, 3000))

  const response = await fetch("http://localhost:3333/tags", {
    next: {
      tags: ["get-tags"]
    }
  })
  const data = await response.json()

  console.log(data)

  return(
    <ul>
      {data.map((item: any) => <li key={item.id}>{item.slug}</li>)}
    </ul>
  )
}
```

Para simular um loading podemos usar o Suspense Api do React.js para isso

```tsx
<Suspense fallback={<p>Carregando tags...</p>}>
  <Tags />
</Suspense>
```

Com o fallback, podemos renderizar o que quisermos enquanto ele tem o primeiro carregamento

## Links para estudo

https://react.dev/reference/react-dom/hooks/useFormStatus

https://nextjs.org/docs/app/building-your-application/rendering/server-components

https://nextjs.org/docs/app/building-your-application/rendering/client-components

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

https://react.dev/reference/react/Suspense

# **DOIS conceitos p criar um app ReactNext mais performático (cache & deduplicação)**

Quando realizamos solicitações HTTPS no Next.js, elas são cacheadas por padrão. No entanto, suponhamos que haja uma funcionalidade que, por padrão, não é cacheada e precisamos implementar o cache para ela.

A deduplicação é um conceito presente no React, diferentemente do cache que encontramos no Next.js. O cache é a prática de armazenar uma cópia da solicitação para uso futuro quando o usuário retornar e precisar dela novamente. Por outro lado, a deduplicação no React ocorre quando dois componentes necessitam dos mesmos dados; nesse caso, o React não busca os dados duas vezes, mas os fornece aos dois componentes que necessitam deles.