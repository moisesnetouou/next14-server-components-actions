import { Tags } from "./tags";
import { AddTag } from "./add-tag";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<p>Carregando tags...</p>}>
        <Tags />
      </Suspense>
      <AddTag />
    </div>
  );
}
